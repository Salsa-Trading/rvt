import * as React from 'react';
import * as _ from 'lodash';
import { Column, SortDirection, ColumnDefaults, ColumnGroup, ColumnDisplay } from './Column';
import GridRow from './GridRow';
import GridHeader, { GridHeaderType } from './GridHeader';
import VirtualTable, { VirtualTableBaseProps } from './VirtualTable';
import strEnum from './utils/strEnum';

export type SortState = {field: string, direction: SortDirection}[];
export type FilterState = {[field: string]: any };
export type GridState = {
  sort?: SortState;
  filter?: FilterState;
  columnDisplay?: ColumnDisplay;
};

export const GridStateChangeType = strEnum([
  'sort',
  'filter',
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
  columnDefaults?: ColumnDefaults;
  header?: GridHeaderType;
};

const RootColumnGroup = '_root_';

export default class Grid extends React.Component<GridProps, {
  columnGroup: ColumnGroup
}> {

  public static propTypes = {
    onGridStateChanged: React.PropTypes.func.isRequired,
    gridState: React.PropTypes.any
  };

  public static defaultProps = {
    gridState: {
      sort: [],
      filter: {}
    } as GridState
  };

  private virtualTable: VirtualTable;

  public static getGridState(gridState: GridState):  GridState {
    return {...Grid.defaultProps, ...gridState};
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      columnGroup: this.createColumns(props)
    };
  }

  public calculateHeights() {
    this.virtualTable.calculateHeights();
  }

  public componentWillReceiveProps(nextProps: React.Props<GridProps> & GridProps) {
    if(this.props.children !== nextProps.children || this.props.gridState !== nextProps.gridState) {
      this.setState({
        columnGroup: this.createColumns(nextProps)
      });
    }
  }

  private createColumns(props: React.Props<GridProps> & GridProps) {
    const { columnDefaults, children } = props;
    const { sort, filter, columnDisplay } = Grid.getGridState(props.gridState);

    const columnGroup = new ColumnGroup({field: RootColumnGroup, children}, columnDefaults, columnDisplay);
    const columns =  columnGroup.getColumns();
    columns.forEach(c => {
      const sortDirection = _.find(sort, s => s.field === c.field);
      c.sortDirection = sortDirection ? sortDirection.direction : null;
      c.filter = _.find(filter, s => s.field === c.field);
    });
    return columnGroup;
  }

  private gridStateHelper() {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);
    const newGridState = {
      sort: gridState.sort,
      filter: gridState.filter,
      columnDisplay: gridState.columnDisplay
    };

    const onGridState = (gridStateChange: GridStateChangeType, change: any, field: string) => {
      if(!onGridStateChanged) {
        return;
      }

      if(gridStateChange === GridStateChangeType.filter) {
        newGridState.filter = change;
      }
      else if(gridStateChange === GridStateChangeType.sort) {
        newGridState.sort = change;
      }
      else if(gridStateChange === GridStateChangeType.columnDisplay) {
        newGridState.columnDisplay = change;
      }

      onGridStateChanged(newGridState, gridStateChange, field);
    };

    const filter = _.cloneDeep(gridState.filter);
    const sort = _.cloneDeep(gridState.sort);
    return { filter, sort, onGridStateChanged: onGridState };
  }

  private onSortSelection(direction: SortDirection, column: Column) {
    const { onGridStateChanged, sort } = this.gridStateHelper();

    _.remove(sort, s => s.field === column.field);
    sort.unshift({field: column.field, direction});
    onGridStateChanged(GridStateChangeType.sort, sort, column.field);
  }

  private onFilterChanged(newFilter: any, column: Column) {
    const { onGridStateChanged, filter } = this.gridStateHelper();

    if(filter === null || filter === undefined) {
      delete filter[column.field];
    }
    else if((typeof filter === 'string' || filter instanceof String) && filter.length === 0) {
      delete filter[column.field];
    }
    else {
      filter[column.field] = newFilter;
    }

    onGridStateChanged(GridStateChangeType.filter, filter, column.field);
  }

  private onWidthChanged(width: number, column: Column) {
    const { onGridStateChanged } = this.gridStateHelper();
    const { columnGroup } = this.state;
    column.width = width;
    onGridStateChanged(GridStateChangeType.columnDisplay, columnGroup.getColumnDisplay(), column.field);
  }

  private onMove(newIndex: number, column: Column) {
    const { onGridStateChanged } = this.gridStateHelper();
    const { columnGroup } = this.state;
    columnGroup.moveColumn(newIndex, column);
    onGridStateChanged(GridStateChangeType.columnDisplay, columnGroup.getColumnDisplay(), column.field);
  }

  public render() {
    const { columnGroup } = this.state;
    const headerClass = this.props.header || GridHeader;
    const columns = columnGroup.getColumns();

    const header = React.createElement(headerClass as any, {
      columns,
      onSortSelection: this.onSortSelection.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onWidthChanged: this.onWidthChanged.bind(this),
      onMove: this.onMove.bind(this)
    });

    const row = <GridRow columns={columns} />;
    const refFn = r => this.virtualTable = r;

    return (
      <VirtualTable
        {...this.props}
        header={header}
        row={row}
        ref={refFn}
      />
    );
  }
}
