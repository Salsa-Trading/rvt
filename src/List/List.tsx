import * as React from 'react';
import * as PropTypes from 'prop-types';
import {FieldSet, RootFieldSet} from './FieldSet';
import {Field, SortDirection, FieldDefaults, FieldDisplay} from './Field';
import strEnum from '../utils/strEnum';
import isNil from '../utils/isNil';
import {isEqual, isUndefined} from 'lodash';

export type SortState = {fieldName: string, direction: SortDirection}[];
export type FilterState = {[fieldName: string]: any};

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

export type ListProps = {
  onListStateChanged: (newListState: ListState, changeType: ListStateChangeType, fieldName?: string) => void;
  listState?: ListState;
  fieldDefaults?: FieldDefaults;
  fixedColumnWidth?: boolean;
};

type BulkWidthChangeProps = [number, Field][];
export type ListViewProps = {
  fieldSet: FieldSet,
  onSortSelection?: (sortDirection: SortDirection, field: Field|FieldSet) => void;
  onFilterChanged?: (filter: any, field: Field|FieldSet) => void;
  onWidthChanged?: (width: number, field: Field|FieldSet) => void;
  onWidthChangedBulk?: (updates: BulkWidthChangeProps) => void;
  onTitleChanged?: (name: string, field: Field|FieldSet) => void;
  onMove?: (newIndex: number, field: Field|FieldSet) => void;
  onHiddenChange?: (hidden: boolean, field: Field|FieldSet) => void;
};

export type ListViewType = React.ComponentClass<ListViewProps>|React.StatelessComponent<ListViewProps>;

export function List(View: ListViewType): React.ComponentClass<ListProps> {

  return class ListContainer extends React.Component<ListProps, {
    fieldSet: FieldSet
  }> {

    public static propTypes = {
      onListStateChanged: PropTypes.func.isRequired,
      listState: PropTypes.any,
      fieldDefaults: PropTypes.any,
      viewRef: PropTypes.func
    };

    public static defaultProps = {
      listState: {
        sorts: [],
        filters: {}
      } as ListState
    };

    public static getListState(listState: ListState):  ListState {
      return {...ListContainer.defaultProps.listState, ...listState};
    }

    constructor(props, context) {
      super(props, context);

      this.state = {
        fieldSet: this.createFields(props)
      };
    }

    public UNSAFE_componentWillMount() {
      this.onSortSelection = this.onSortSelection.bind(this);
      this.onFilterChanged = this.onFilterChanged.bind(this);
      this.onWidthChanged = this.onWidthChanged.bind(this);
      this.onWidthChangedBulk = this.onWidthChangedBulk.bind(this);
      this.onTitleChanged = this.onTitleChanged.bind(this);
      this.onHiddenChange = this.onHiddenChange.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onHiddenChange = this.onHiddenChange.bind(this);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: React.Props<ListProps> & ListProps) {
      const prevFieldProps = getFieldProps(this.props);
      const nextFieldProps = getFieldProps(nextProps);

      // If field definitions have changed, regenerate fields
      if(!isEqual(prevFieldProps, nextFieldProps)) {
        const fieldSet = this.createFields(nextProps);
        this.setState({
          fieldSet
        });
      }
    }

    private createFields(props: React.Props<ListProps> & ListProps): FieldSet {
      const {fieldDefaults, children, fixedColumnWidth} = props;
      const {sorts, filters, fields} = ListContainer.getListState(props.listState);

      const fieldSet = new FieldSet({name: RootFieldSet, children, fixedColumnWidth}, fieldDefaults, fields);
      const allFields = fieldSet.getFields();
      for(const c of allFields) {
        const sortDirection = sorts.find(s => s.fieldName === c.name);
        c.sortDirection = sortDirection?.direction || c.sortDirection;
        c.filter = filters[c.name];
      }

      return fieldSet;
    }

    private onListStateChanged(updates: Partial<ListState>, changeType: ListStateChangeType, fieldName?: string) {
      const {onListStateChanged} = this.props;
      const newListState: ListState = {
        ...ListContainer.defaultProps.listState,
        ...this.props.listState,
        ...updates
      };
      onListStateChanged?.(newListState, changeType, fieldName);
    }

    private onSortSelection(direction: SortDirection, field: Field) {
      const sorts: SortState = [...this.props.listState.sorts || ListContainer.defaultProps.listState.sorts];

      // Remove previous entry if it exists
      const index = sorts.findIndex(s => s.fieldName === field.name);
      if(index >= 0) {
        sorts.splice(index, 1);
      }

      // Add the new sort the beginning
      sorts.unshift({fieldName: field.name, direction});
      this.onListStateChanged({sorts}, 'sorts', field.name);
    }

    private onFilterChanged(filter: FilterState, field: Field) {

      const filters: FilterState = {
        ...ListContainer.defaultProps.listState.filters,
        ...this.props.listState.filters
      };

      if(isNil(filter)) {
        delete filters[field.name];
      } else if((typeof filter === 'string' || filter instanceof String) && filter.length === 0) {
        delete filters[field.name];
      } else {
        filters[field.name] = filter;
      }

      this.onListStateChanged({filters}, 'filters', field.name);
    }

    private onWidthChanged(width: number, field: Field) {
      const {fieldSet} = this.state;

      // Note: this is a hack.
      // For some reason the 'field' we receive
      // is sometimes different from the field in the fieldSet
      const fieldSetField = fieldSet.findFieldByName(field.name);
      if(fieldSetField && width !== fieldSetField.width && fieldSetField !== field) {
        fieldSetField.resize(width);
      }

      if(isUndefined(field.width) || field.width !== width) {
        field.resize(width);
        const fields: FieldDisplay = fieldSet.getFieldDisplay();
        this.onListStateChanged({fields}, 'fields', field.name);
      }
    }

    private onWidthChangedBulk(updates: BulkWidthChangeProps) {
      const {fieldSet} = this.state;
      updates.forEach(([width, field]) => {
        // Note: this is a hack.
        // For some reason the 'field' we receive
        // is sometimes different from the field in the fieldSet
        const fieldSetField = fieldSet.findFieldByName(field.name);
        if(fieldSetField
            && width !== fieldSetField.width
            && fieldSetField !== field
            && !fieldSetField.fixedColumnWidth) {
          fieldSetField.resize(width);
        }

        if(field.width !== width && !field.fixedColumnWidth) {
          field.resize(width);
        }
      });

      const fields: FieldDisplay = fieldSet.getFieldDisplay();
      this.onListStateChanged({fields}, ListStateChangeType.fields);
    }

    private onTitleChanged(title: string, field: Field) {
      const {fieldSet} = this.state;

      // Note: this is a hack.
      // For some reason the 'field' we receive
      // is different from the field in the fieldSet
      const fieldSetField = fieldSet.findFieldByName(field.name);
      if(fieldSetField && fieldSetField !== field) {
        fieldSetField.updateTitle(title);
      }

      if(field.title !== title) {
        field.updateTitle(title);
        const fields: FieldDisplay = fieldSet.getFieldDisplay();
        this.onListStateChanged({fields}, 'fields', field.name);
      }
    }

    private onMove(newIndex: number, field: Field) {
      const {fieldSet} = this.state;
      fieldSet.moveField(newIndex, field);
      const fields = fieldSet.getFieldDisplay();
      this.onListStateChanged({fields}, 'fields', field.name);
    }

    private onHiddenChange(hidden: boolean, field: Field|FieldSet) {
      const {fieldSet} = this.state;
      const f = fieldSet.findFieldByName(field.name);
      f.hidden = hidden;
      const fields: FieldDisplay = fieldSet.getFieldDisplay();
      this.onListStateChanged({fields}, 'fields', field.name);
    }

    public render() {
      const {fieldSet} = this.state;

      /* tslint:disable:no-unused-variable */
      const {listState, onListStateChanged, fieldDefaults, ...ownProps} = this.props;
      /* tslint:enable:no-unused-variable */

      const props = {
        fieldSet,
        onSortSelection: this.onSortSelection,
        onFilterChanged: this.onFilterChanged,
        onWidthChanged: this.onWidthChanged,
        onWidthChangedBulk: this.onWidthChangedBulk,
        onTitleChanged: this.onTitleChanged,
        onMove: this.onMove,
        onHiddenChange: this.onHiddenChange
      };

      return (
        <View
          {...ownProps}
          {...props}
        />
      );
    }
  };
}

type FieldDefinitionProps = {
  children?: React.ReactNode;
  fieldDefaults?: FieldDefaults;
  fixedColumnWidth?: boolean;
  sorts?: SortState;
  filters?: FilterState;
  hiddenKey?: string;
};

function getFieldProps(props: React.Props<ListProps> & ListProps): FieldDefinitionProps {
  return {
    children: props.children,
    fieldDefaults: props.fieldDefaults,
    fixedColumnWidth: props.fixedColumnWidth,
    sorts: props.listState?.sorts,
    filters: props.listState?.filters,
    hiddenKey: props.listState && generateHiddenKey(props.listState.fields)
  };
}

function generateHiddenKey(fields: FieldDisplay) {
  if(!fields) {
    return '';
  }
  const {hidden, children} = fields;
  return `${Boolean(hidden)}${(children || []).map(generateHiddenKey)}`;
}
