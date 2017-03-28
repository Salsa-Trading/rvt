import * as React from 'react';
import * as _ from 'lodash';
import { Column, ColumnDefinitionProps, SortDirection } from './Column';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import Table, { TableBaseProps } from './Table';

export type GridState = {
  sort: {field: string, direction: SortDirection}[];
  filter: {[field: string]: any };
  width: {[field: string]: number|string };
  order: {field: string, hidden: boolean}[];
};

export default class Grid extends React.Component<TableBaseProps & {
  onGridStateChanged: (newGridState: GridState, isDataChange: boolean, field?: string) => void;
  gridState: GridState;
  columnDefaults?: {
    sortable?: boolean;
    filterable?: boolean;
  }
}, {
  // columns: Column[]
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

  constructor(props, context) {
    super(props, context);
    this.state = {
      // columns: this.createColumns()
    };
  }

  public calculateHeights() {
    this.table.calculateHeights();
  }

  private createColumns(): Column[] {
    const { gridState, columnDefaults } = this.props;
    return _.reject(_.map<any, ColumnDefinitionProps>(React.Children.toArray(this.props.children), 'props').map(c => {
      const sort = _.find(gridState.sort, s => s.field === c.field);
      let order = _.find(gridState.order, s => s.field === c.field);
      return {
        ...columnDefaults,
        ...c,
        sortDirection: (sort && sort.direction) || undefined,
        filter: gridState.filter[c.field],
        width: gridState.width[c.field],
        hidden: order && order.hidden
      };
    }), 'hidden');
  }

  private onSortSelection(direction: SortDirection, column: Column) {
    const { gridState, onGridStateChanged } = this.props;
    const newGridState = _.cloneDeep(gridState);
    _.remove(newGridState.sort, s => s.field === column.field);
    newGridState.sort.unshift({field: column.field, direction});
    onGridStateChanged(newGridState, true, column.field);
  }

  private onFilterChanged(filter: any, column: Column) {
    const { gridState, onGridStateChanged } = this.props;
    const newGridState = _.cloneDeep(gridState);
    newGridState.filter[column.field] = filter;
    onGridStateChanged(newGridState, true, column.field);
  }

  private onWidthChanged(width: number, column: Column) {
    const { gridState, onGridStateChanged } = this.props;
    const newGridState = _.cloneDeep(gridState);
    console.log('here', column, width, gridState, newGridState);
    newGridState.width[column.field] = width;
    onGridStateChanged(newGridState, false, column.field);
  }

  private onMove(newIndex: number, oldIndex: number) {
    const { gridState, onGridStateChanged } = this.props;
    const newGridState = _.cloneDeep(gridState);
    newGridState.order.splice(newIndex, 0, newGridState.order.splice(oldIndex, 1)[0]);
    onGridStateChanged(newGridState, false);
  }

  public render() {
    const columns = this.createColumns();
    console.log(columns);
    const header = <GridHeader
      columns={columns}
      onSortSelection={this.onSortSelection.bind(this)}
      onFilterChanged={this.onFilterChanged.bind(this)}
      onWidthChanged={this.onWidthChanged.bind(this)}
      onMove={this.onMove.bind(this)}
    />;
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

