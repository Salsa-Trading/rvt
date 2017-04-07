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

export interface FieldPropsBase {
  name: string;
  header?: JSX.Element|string;
  filterControl?: React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
  showAlways?: boolean;
}

export interface FieldProps extends FieldPropsBase, React.Props<FieldProps> {
  cell?: (data: any) => JSX.Element;
}

export abstract class FieldBase implements FieldPropsBase {
  public name: string;
  public header?: JSX.Element|string;
  public filterControl?: React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
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

  public cell?: (data: any) => JSX.Element;

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
    cell: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

