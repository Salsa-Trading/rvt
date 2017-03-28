import * as React from 'react';

export type SortDirection = 'asc'|'desc';

export type ColumnDefinitionProps = {
  name?: string;
  field?: string;
  cell?: (data: any) => JSX.Element
  header?: JSX.Element|string;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
};

export class ColumnDefinition extends React.Component<ColumnDefinitionProps, {}> {

  public static propTypes = {
    name: React.PropTypes.string,
    field: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any,
    defaultWidth: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    sortable: React.PropTypes.bool,
    filterable: React.PropTypes.bool
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


export type Column = ColumnDefinitionProps & {
  width: number|string;
  sortDirection?: SortDirection;
  filter?: any;
  hidden: boolean;
};
