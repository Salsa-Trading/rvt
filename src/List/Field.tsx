import * as React from 'react';
import strEnum from '../utils/strEnum';
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
  children?: FieldDisplay[];
}

export interface FieldProps extends React.Props<FieldProps> {
  name: string;
  cell?: (data: any) => JSX.Element;
  header?: JSX.Element|string;
  filterControl?: React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
}

export class Field implements FieldProps {

  public name: string;
  public cell?: (data: any) => JSX.Element;
  public header?: JSX.Element|string;
  public filterControl?: React.ComponentClass<FilterControlProps>|React.StatelessComponent<FilterControlProps>;
  public width?: number|string;
  public sortable?: boolean;
  public filterable?: boolean;
  public sortDirection?: SortDirection;
  public filter?: any;
  public hidden?: boolean;

  constructor(props: FieldProps) {
    Object.assign(this, props);
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

export class FieldDefinition extends React.Component<FieldProps, {}> {

  public static propTypes = {
    name: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any,
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    sortable: React.PropTypes.bool,
    filterable: React.PropTypes.bool,
    sortDirection: React.PropTypes.string,
    filter: React.PropTypes.any,
    hidden: React.PropTypes.bool
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

