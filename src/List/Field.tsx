import * as React from 'react';
import * as PropTypes from 'prop-types';
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
  title?: string;
  width?: number;
  hidden?: boolean;
  children?: FieldDisplay[];
}

export interface HeaderProps {
  field: FieldPropsBase;
}

export type CellType = React.ComponentClass<CellProps>|React.StatelessComponent<CellProps>|React.ReactElement<CellProps>;
export type FormatType = (data: any, field: FieldProps) => string|JSX.Element;
export type FilterControlType = React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
export type HeaderType = JSX.Element|string|React.ComponentClass<HeaderProps>|React.StatelessComponent<HeaderProps>;

export interface FieldPropsBase {
  name: string;
  title?: string;
  header?: HeaderType;
  filterControl?: FilterControlType;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
  showAlways?: boolean;
  fixedColumnWidth?: boolean;
}

export type CellProps = {
  data: any;
  field: FieldProps;
};

export interface FieldProps extends FieldPropsBase, React.Props<FieldProps> {
  format?: FormatType;
  cell?: CellType;
}

// Do not allow columns narrower than this
const MIN_WIDTH = 10;

export abstract class FieldBase implements FieldPropsBase {
  public name: string;
  public title: string;
  public header?: HeaderType;
  public filterControl?: FilterControlType;
  public width?: number;
  public sortable?: boolean;
  public filterable?: boolean;
  public sortDirection?: SortDirection;
  public filter?: any;
  public abstract hidden?: boolean;
  public showAlways?: boolean;

  constructor(props: FieldPropsBase, fieldDisplay: FieldDisplay) {
    Object.assign(this, props);
    this.width = fieldDisplay && !isNil(fieldDisplay.width) ? fieldDisplay.width : props.width;
    this.title = fieldDisplay && fieldDisplay.title;
  }

  public getFields(): Field[] {
    if(this.hidden) {
      return [];
    }
    return [this as Field];
  }

  public getFieldDisplay(): FieldDisplay {
    return {
      name: this.name,
      width: this.width,
      hidden: this.hidden,
      title: this.title
    };
  }

  public getFieldCount() {
    return 1;
  }

  public resize(width: number) {
    const newWidth = Math.max(MIN_WIDTH, width);
    this.width = newWidth;
  }

  public updateTitle(title: string) {
    this.title = title;
  }
}

export class Field extends FieldBase implements FieldProps {

  public format?: FormatType;
  public cell?: CellType;
  public hidden?: boolean;
  public width?: number;

  constructor(props: FieldProps, fieldDisplay: FieldDisplay) {
    super(props, fieldDisplay);
    const { cell, hidden } = props;
    this.hidden = fieldDisplay && !isNil(fieldDisplay.hidden) ? fieldDisplay.hidden : hidden;
    this.cell = cell;
    this.width = fieldDisplay && (fieldDisplay.width || undefined);
  }
}

export const FieldBasePropTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.any,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  sortDirection: PropTypes.string,
  filter: PropTypes.any,
  hidden: PropTypes.bool,
  showAlways: PropTypes.bool
};

export class FieldDefinition extends React.Component<FieldProps, {}> {

  public static propTypes = {
    ...FieldBasePropTypes,
    cell: PropTypes.any,
    format: PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

