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

export type ListState = {
  sorts?: SortState;
  filters?: FilterState;
  fields?: FieldDisplay;
};

export const ListStateChangeType = strEnum([
  'sorts',
  'filters',
  'fields'
]);
export type ListStateChangeType = keyof typeof ListStateChangeType;

export function isDataChange(changeType: ListStateChangeType) {
  return changeType === ListStateChangeType.sorts || changeType === ListStateChangeType.filters;
}

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export type ListProps = VirtualTableBaseProps & {
  getRow: (rowIndex: number) => RowData;
  onListStateChanged: (newListState: ListState, changeType: ListStateChangeType, field?: string) => void;
  listState?: ListState;
  fieldDefaults?: FieldDefaults;
  header?: GridHeaderType;
};

export default class List extends React.Component<ListProps, {
  fieldSet: FieldSet
}> {

  public static propTypes = {
    onListStateChanged: React.PropTypes.func.isRequired,
    listState: React.PropTypes.any
  };

  public static defaultProps = {
    listState: {
      sorts: [],
      filters: {}
    } as ListState
  };

  private virtualTable: VirtualTable;

  public static getListState(listState: ListState):  ListState {
    return {...List.defaultProps, ...listState};
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

  public componentWillReceiveProps(nextProps: React.Props<ListProps> & ListProps) {
    if(this.props.children !== nextProps.children || this.props.listState.fields !== nextProps.listState.fields) {
      this.setState({
        fieldSet: this.createFields(nextProps)
      });
    }
  }

  private createFields(props: React.Props<ListProps> & ListProps) {
    const { fieldDefaults, children } = props;
    const { sorts, filters, fields } = List.getListState(props.listState);

    const fieldSet = new FieldSet({field: RootFieldSet, children}, fieldDefaults, fields);
    fieldSet.getFields().forEach(c => {
      const sortDirection = _.find(sorts, s => s.field === c.field);
      c.sortDirection = sortDirection ? sortDirection.direction : null;
      c.filter = _.find(filters, s => s.field === c.field);
    });
    return fieldSet;
  }

  private listStateHelper() {
    const { onListStateChanged } = this.props;
    const listState = List.getListState(this.props.listState);
    const newListState = {
      sorts: listState.sorts,
      filters: listState.filters,
      fields: listState.fields
    };

    const onListState = (listStateChange: ListStateChangeType, change: any, field: string) => {
      if(!onListStateChanged) {
        return;
      }

      if(listStateChange === ListStateChangeType.filters) {
        newListState.filters = change;
      }
      else if(listStateChange === ListStateChangeType.sorts) {
        newListState.sorts = change;
      }
      else if(listStateChange === ListStateChangeType.fields) {
        newListState.fields = change;
      }

      onListStateChanged(newListState, listStateChange, field);
    };

    const filters = _.cloneDeep(listState.filters);
    const sorts = _.cloneDeep(listState.sorts);
    return { filters, sorts, onListStateChanged: onListState };
  }

  private onSortSelection(direction: SortDirection, field: Field) {
    const { onListStateChanged, sorts } = this.listStateHelper();

    _.remove(sorts, s => s.field === field.field);
    sorts.unshift({field: field.field, direction});
    onListStateChanged(ListStateChangeType.sorts, sorts, field.field);
  }

  private onFilterChanged(filter: any, field: Field) {
    const { onListStateChanged, filters } = this.listStateHelper();

    if(filter === null || filter === undefined) {
      delete filters[field.field];
    }
    else if((typeof filter === 'string' || filter instanceof String) && filter.length === 0) {
      delete filters[field.field];
    }
    else {
      filters[field.field] = filter;
    }

    onListStateChanged(ListStateChangeType.filters, filters, field.field);
  }

  private onWidthChanged(width: number, field: Field) {
    const { onListStateChanged } = this.listStateHelper();
    const { fieldSet } = this.state;
    field.resize(width);
    onListStateChanged(ListStateChangeType.fields, fieldSet.getFieldDisplay(), field.field);
  }

  private onMove(newIndex: number, field: Field) {
    const { onListStateChanged } = this.listStateHelper();
    const { fieldSet } = this.state;
    fieldSet.moveField(newIndex, field);
    onListStateChanged(ListStateChangeType.fields, fieldSet.getFieldDisplay(), field.field);
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

