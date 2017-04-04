import * as React from 'react';
import * as _ from 'lodash';
import { FieldSet, RootFieldSet } from './FieldSet';
import { Field, SortDirection, FieldDefaults, FieldDisplay } from './Field';
import GridRow from '../GridRow';
import GridHeader, { GridHeaderType } from '../GridHeader';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';
import strEnum from '../utils/strEnum';

export type SortState = {field: string, direction: SortDirection}[];
export type FilterState = {[field: string]: any };

export type GridState = {
  sorts?: SortState;
  filters?: FilterState;
  fields?: FieldDisplay;
};

export const GridStateChangeType = strEnum([
  'sorts',
  'filters',
  'fields'
]);
export type GridStateChangeType = keyof typeof GridStateChangeType;

export function isDataChange(changeType: GridStateChangeType) {
  return changeType === GridStateChangeType.sorts || changeType === GridStateChangeType.filters;
}

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export type GridProps = VirtualTableBaseProps & {
  getRow: (rowIndex: number) => RowData;
  onGridStateChanged: (newGridState: GridState, changeType: GridStateChangeType, field?: string) => void;
  gridState?: GridState;
  fieldDefaults?: FieldDefaults;
  header?: GridHeaderType;
};

export default class Grid extends React.Component<GridProps, {
  fieldSet: FieldSet
}> {

  public static propTypes = {
    onGridStateChanged: React.PropTypes.func.isRequired,
    gridState: React.PropTypes.any
  };

  public static defaultProps = {
    gridState: {
      sorts: [],
      filters: {}
    } as GridState
  };

  private virtualTable: VirtualTable;

  public static getGridState(gridState: GridState):  GridState {
    return {...Grid.defaultProps, ...gridState};
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      fieldSet: this.createFields(props)
    };
  }

  public calculateHeights() {
    this.virtualTable.calculateHeights();
  }

  public componentWillReceiveProps(nextProps: React.Props<GridProps> & GridProps) {
    if(this.props.children !== nextProps.children || this.props.gridState.fields !== nextProps.gridState.fields) {
      this.setState({
        fieldSet: this.createFields(nextProps)
      });
    }
  }

  private createFields(props: React.Props<GridProps> & GridProps) {
    const { fieldDefaults, children } = props;
    const { sorts, filters, fields } = Grid.getGridState(props.gridState);

    const fieldSet = new FieldSet({field: RootFieldSet, children}, fieldDefaults, fields);
    fieldSet.getFields().forEach(c => {
      const sortDirection = _.find(sorts, s => s.field === c.field);
      c.sortDirection = sortDirection ? sortDirection.direction : null;
      c.filter = _.find(filters, s => s.field === c.field);
    });
    return fieldSet;
  }

  private gridStateHelper() {
    const { onGridStateChanged } = this.props;
    const gridState = Grid.getGridState(this.props.gridState);
    const newGridState = {
      sorts: gridState.sorts,
      filters: gridState.filters,
      fields: gridState.fields
    };

    const onGridState = (gridStateChange: GridStateChangeType, change: any, field: string) => {
      if(!onGridStateChanged) {
        return;
      }

      if(gridStateChange === GridStateChangeType.filters) {
        newGridState.filters = change;
      }
      else if(gridStateChange === GridStateChangeType.sorts) {
        newGridState.sorts = change;
      }
      else if(gridStateChange === GridStateChangeType.fields) {
        newGridState.fields = change;
      }

      onGridStateChanged(newGridState, gridStateChange, field);
    };

    const filters = _.cloneDeep(gridState.filters);
    const sorts = _.cloneDeep(gridState.sorts);
    return { filters, sorts, onGridStateChanged: onGridState };
  }

  private onSortSelection(direction: SortDirection, field: Field) {
    const { onGridStateChanged, sorts } = this.gridStateHelper();

    _.remove(sorts, s => s.field === field.field);
    sorts.unshift({field: field.field, direction});
    onGridStateChanged(GridStateChangeType.sorts, sorts, field.field);
  }

  private onFilterChanged(filter: any, field: Field) {
    const { onGridStateChanged, filters } = this.gridStateHelper();

    if(filter === null || filter === undefined) {
      delete filters[field.field];
    }
    else if((typeof filter === 'string' || filter instanceof String) && filter.length === 0) {
      delete filters[field.field];
    }
    else {
      filters[field.field] = filter;
    }

    onGridStateChanged(GridStateChangeType.filters, filters, field.field);
  }

  private onWidthChanged(width: number, field: Field) {
    const { onGridStateChanged } = this.gridStateHelper();
    const { fieldSet } = this.state;
    field.resize(width);
    onGridStateChanged(GridStateChangeType.fields, fieldSet.getFieldDisplay(), field.field);
  }

  private onMove(newIndex: number, field: Field) {
    const { onGridStateChanged } = this.gridStateHelper();
    const { fieldSet } = this.state;
    fieldSet.moveField(newIndex, field);
    onGridStateChanged(GridStateChangeType.fields, fieldSet.getFieldDisplay(), field.field);
  }

  public render() {
    const { fieldSet } = this.state;
    const headerClass = this.props.header || GridHeader;

    const header = React.createElement(headerClass as any, {
      fieldSet,
      onSortSelection: this.onSortSelection.bind(this),
      onFilterChanged: this.onFilterChanged.bind(this),
      onWidthChanged: this.onWidthChanged.bind(this),
      onMove: this.onMove.bind(this)
    });

    const fields = fieldSet.getFields();
    const row = <GridRow fields={fields} />;
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

