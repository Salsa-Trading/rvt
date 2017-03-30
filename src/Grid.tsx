import * as React from 'react';
import * as _ from 'lodash';
import { Column, SortDirection } from './Column';
import GridRow from './GridRow';
import GridHeader, { GridHeaderType } from './GridHeader';
import VirtualTable, { VirtualTableBaseProps } from './VirtualTable';
import strEnum from './utils/strEnum';

export type GridState = {
  sort?: {field: string, direction: SortDirection}[];
  filter?: {[field: string]: any };
  width?: {[field: string]: number|string };
  columnDisplay?: {field: string, hidden: boolean}[];
};

export const GridStateChangeType = strEnum([
  'sort',
  'filter',
  'width',
  'columnDisplay'
]);
export type GridStateChangeType = keyof typeof GridStateChangeType;

export function isDataChange(changeType: GridStateChangeType) {
  return changeType === GridStateChangeType.sort || changeType === GridStateChangeType.filter;
}

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export type GridProps = VirtualTableBaseProps & {
  getRow: (rowIndex: number) => RowData;
  onGridStateChanged: (newGridState: GridState, changeType: GridStateChangeType, field?: string) => void;
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
      columnDisplay: []
    } as GridState
  };

  private virtualTable: VirtualTable;

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
    this.virtualTable.calculateHeights();
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
    const { sort, columnDisplay, filter, width } = Grid.getGridState(props.gridState);

    let columns = _.map<any, Column>(React.Children.toArray(props.children), 'props').map(c => {
      const colSort = _.find(sort, s => s.field === c.field);
      const colDisplay = _.find(columnDisplay, s => s.field === c.field);

      const columnState = _.omitBy({
        sortDirection: colSort && colSort.direction,
        filter: filter[c.field],
        width: width[c.field],
        hidden: colDisplay && colDisplay.hidden
      }, _.isUndefined);

      return {
        ...columnDefaults,
        ...c,
        ...columnState
      };
    });

    if(columnDisplay && columnDisplay.length > 0) {
      columns = _.sortBy(columns, c => columnDisplay.findIndex(o => o.field === c.field));
    }

    return _.reject(columns, 'hidden');
  }

  private gridStateHelper(ensureColumnDisplay = false) {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);
    const newGridState = _.cloneDeep(gridState);

    if(ensureColumnDisplay) {
      if(!gridState.columnDisplay || gridState.columnDisplay.length === 0) {
        const { columns } = this.state;
        newGridState.columnDisplay = columns.map(c => ({field: c.field, hidden: false}));
      }
    }
    return { newGridState, onGridStateChanged };
  }

  private onSortSelection(direction: SortDirection, column: Column) {
    const { onGridStateChanged, newGridState } = this.gridStateHelper();

    _.remove(newGridState.sort, s => s.field === column.field);
    newGridState.sort.unshift({field: column.field, direction});
    onGridStateChanged(newGridState, GridStateChangeType.sort, column.field);
  }

  private onFilterChanged(filter: any, column: Column) {
    const { onGridStateChanged, newGridState } = this.gridStateHelper();

    if(filter === null || filter === undefined) {
      delete newGridState.filter[column.field];
    }
    else if((typeof filter === 'string' || filter instanceof String) && filter.length === 0) {
      delete newGridState.filter[column.field];
    }
    else {
      newGridState.filter[column.field] = filter;
    }

    onGridStateChanged(newGridState,  GridStateChangeType.filter, column.field);
  }

  private onWidthChanged(width: number, column: Column) {
    const { onGridStateChanged, newGridState } = this.gridStateHelper();

    newGridState.width[column.field] = width;
    onGridStateChanged(newGridState,  GridStateChangeType.width, column.field);
  }

  private onMove(newIndex: number, column: Column) {
    const { onGridStateChanged, newGridState } = this.gridStateHelper(true);

    const oldIndex = newGridState.columnDisplay.findIndex(o => o.field === column.field);
    newGridState.columnDisplay.splice(newIndex, 0, newGridState.columnDisplay.splice(oldIndex, 1)[0]);
    onGridStateChanged(newGridState,  GridStateChangeType.columnDisplay, column.field);
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
      <VirtualTable
        {...this.props}
        header={header}
        row={row}
        ref={r => this.virtualTable = r } />
    );
  }
}

