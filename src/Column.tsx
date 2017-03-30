import * as React from 'react';
import strEnum from './utils/strEnum';

export const SortDirection = strEnum([
  'asc',
  'desc'
]);
export type SortDirection = keyof typeof SortDirection;

export interface ColumnProps {
  field?: string;
  cell?: (data: any) => JSX.Element;
  header?: JSX.Element|string;
  filterControl?: JSX.Element|string;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
};

export class Column implements ColumnProps {

  public field?: string;
  public cell?: (data: any) => JSX.Element;
  public header?: JSX.Element|string;
  public filterControl?: JSX.Element|string;
  public width?: number|string;
  public sortable?: boolean;
  public filterable?: boolean;
  public sortDirection?: SortDirection;
  public filter?: any;
  public hidden?: boolean;

  constructor(props: ColumnProps) {
    Object.assign(this, props);
  }

  public getColumns(): Column[] {
    if(this.hidden) {
      return [];
    }
    return [this];
  }

}

export class ColumnDefinition extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    field: React.PropTypes.string,
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

  public static defaultProps = {
    sortable: false,
    filterable: false
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

export interface ColumnGroupProps {
  field?: string;
  header?: JSX.Element|string;
  hidden?: boolean;
}

export class ColumnGroup {

  public field?: string;
  public header?: JSX.Element|string;
  public hidden?: boolean;
  public children: Column[];

  constructor(props: ColumnProps) {
    Object.assign(this, props);
  }

  public getColumns(): Column[] {
    if(this.hidden) {
      return [];
    }
    const columns: Column[] = [];
    for(let i = 0; i < this.children.length; i++) {
      columns.concat(this.children[i].getColumns());
    }
    return columns;
  }
}


export class ColumnGroupDefinition extends React.Component<ColumnGroup, {}> {

  public static propTypes = {
    header: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}
