import * as React from 'react';
import strEnum from '../utils/strEnum';
import isNil from '../utils/isNil';
import { FilterControlProps } from '../Filter';

export const SortDirection = strEnum([
  'asc',
  'desc'
]);
export type SortDirection = keyof typeof SortDirection;

export type FieldDefaults = {
  sortable?: boolean;
  filterable?: boolean;
};

export interface FieldDisplay {
  name: string;
  width?: number|string;
  hidden?: boolean;
}

export type CellType = React.ComponentClass<CellProps>|React.StatelessComponent<CellProps>;
export type FilterControlType = React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
export type HeaderType = JSX.Element|string|React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;

export interface FieldPropsBase {
  name: string;
  header?: HeaderType;
  filterControl?: FilterControlType;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
  showAlways?: boolean;
}

export type CellProps = {
  data: any;
  field: FieldProps;
};

export interface FieldProps extends FieldPropsBase, React.Props<FieldProps> {
  format?: (data: any, field: FieldProps) => string;
  cell?: CellType;
}

export abstract class FieldBase implements FieldPropsBase {
  public name: string;
  public header?: HeaderType;
  public filterControl?: FilterControlType;
  public width?: number|string;
  public sortable?: boolean;
  public filterable?: boolean;
  public sortDirection?: SortDirection;
  public filter?: any;
  public hidden?: boolean;
  public showAlways?: boolean;

  constructor(props: FieldPropsBase, fieldDisplay: FieldDisplay) {
    Object.assign(this, props);
    this.hidden = fieldDisplay && !isNil(fieldDisplay.hidden) ? fieldDisplay.hidden : props.hidden;
    this.width = fieldDisplay && !isNil(fieldDisplay.width) ? fieldDisplay.width : props.width;
  }

  public getFields(): Field[] {
    if(this.hidden) {
      return [];
    }
    return [this];
  }

  public getFieldDisplay(): FieldDisplay {
    return {
      name: this.name,
      width: this.width,
      hidden: this.hidden
    };
  }

  public getCount() {
    return 1;
  }

  public resize(width: number) {
    this.width = width;
  }
}

export class Field extends FieldBase implements FieldProps {

  public format?: (data: any, field: FieldProps) => string;
  public cell?: CellType;

  constructor(props: FieldProps, fieldDisplay: FieldDisplay) {
    super(props, fieldDisplay);
    this.cell = props.cell;
  }

}

export const FieldBasePropTypes = {
  name: React.PropTypes.string.isRequired,
  header: React.PropTypes.any,
  width: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  sortable: React.PropTypes.bool,
  filterable: React.PropTypes.bool,
  sortDirection: React.PropTypes.string,
  filter: React.PropTypes.any,
  hidden: React.PropTypes.bool,
  showAlways: React.PropTypes.bool
};

export class FieldDefinition extends React.Component<FieldProps, {}> {

  public static propTypes = {
    ...FieldBasePropTypes,
    cell: React.PropTypes.any,
    format: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

