import * as React from 'react';
import * as _ from 'lodash';
import { Column, SortDirection } from './Column';
import GridRow from './GridRow';
import GridHeader, { GridHeaderType } from './GridHeader';
import Table, { TableBaseProps } from './Table';

export type GridState = {
  sort?: {field: string, direction: SortDirection}[];
  filter?: {[field: string]: any };
  width?: {[field: string]: number|string };
  order?: {field: string, hidden: boolean}[];
};

type GridProps = TableBaseProps & {
  onGridStateChanged: (newGridState: GridState, isDataChange: boolean, field?: string) => void;
  gridState?: GridState;
  columnDefaults?: {
    sortable?: boolean;
    filterable?: boolean;
  },
  header?: GridHeaderType;
};

export default class Grid extends React.Component<GridProps, {
  columns: Column[]
}> {

  public static propTypes = {
    onGridStateChanged: React.PropTypes.func.isRequired,
    gridState: React.PropTypes.any
  };

  public static defaultProps = {
    gridState: {
      sort: [],
      filter: {},
      width: {},
      order: []
    }
  };

  private table: Table;

  public static getGridState(gridState: GridState):  GridState {
    return {...Grid.defaultProps, ...gridState};
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      columns: this.createColumns(props)
    };
  }

  public calculateHeights() {
    this.table.calculateHeights();
  }

  public componentWillReceiveProps(nextProps: React.Props<GridProps> & GridProps) {
    if(this.props.children !== nextProps.children || this.props.gridState !== nextProps.gridState) {
      this.setState({
        columns: this.createColumns(nextProps)
      });
    }
  }

  private createColumns(props: React.Props<GridProps> & GridProps): Column[] {
    const { columnDefaults } = props;
    const { sort, order, filter, width } = Grid.getGridState(props.gridState);

    let columns = _.map<any, Column>(React.Children.toArray(props.children), 'props').map(c => {
      const colSort = _.find(sort, s => s.field === c.field);
      const colOrder = _.find(order, s => s.field === c.field);

      const columnState = _.omitBy({
        sortDirection: colSort && colSort.direction,
        filter: filter[c.field],
        width: width[c.field],
        hidden: colOrder && colOrder.hidden
      }, _.isUndefined);

      return {
        ...columnDefaults,
        ...c,
        ...columnState
      };
    });

    if(order && order.length > 0) {
      columns = _.sortBy(columns, c => order.findIndex(o => o.field === c.field));
    }

    return _.reject(columns, 'hidden');
  }

  private onSortSelection(direction: SortDirection, column: Column) {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);

    const newGridState = _.cloneDeep(gridState);
    _.remove(newGridState.sort, s => s.field === column.field);
    newGridState.sort.unshift({field: column.field, direction});
    onGridStateChanged(newGridState, true, column.field);
  }

  private onFilterChanged(filter: any, column: Column) {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);

    const newGridState = _.cloneDeep(gridState);
    newGridState.filter[column.field] = filter;
    onGridStateChanged(newGridState, true, column.field);
  }

  private onWidthChanged(width: number, column: Column) {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);

    const newGridState = _.cloneDeep(gridState);
    newGridState.width[column.field] = width;
    onGridStateChanged(newGridState, false, column.field);
  }

  private getOrder(gridState: GridState) {
    if(gridState.order && gridState.order.length > 0) {
      return gridState.order;
    }
    const { columns } = this.state;
    return columns.map(c => ({field: c.field, hidden: false}));
  }

  private onMove(newIndex: number, column: Column) {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);
    const newGridState = _.cloneDeep(gridState);
    newGridState.order = this.getOrder(gridState);

    const oldIndex = newGridState.order.findIndex(o => o.field === column.field);
    newGridState.order.splice(newIndex, 0, newGridState.order.splice(oldIndex, 1)[0]);
    onGridStateChanged(newGridState, false);
  }

  public render() {
    const { columns } = this.state;
    const headerClass = this.props.header || GridHeader;

    const header = React.createElement(headerClass as any, {
      columns,
      onSortSelection: this.onSortSelection.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onWidthChanged: this.onWidthChanged.bind(this),
      onMove: this.onMove.bind(this)
    });

    const row = <GridRow columns={columns} />;

    return (
      <Table
        {...this.props}
        header={header}
        row={row}
        ref={r => this.table = r } />
    );
  }
}

