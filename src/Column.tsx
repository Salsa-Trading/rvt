import * as React from 'react';
import { SortDirections } from './SortDirection';

export type ColumnProps = {
  canSort?: boolean;
  sortDirection?: SortDirections;
  name?: string;
  field?: string;
  format?: (data) => any;
  cell?: any;
  header?: any;
}

export default class Column extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    canSort: React.PropTypes.bool,
    name: React.PropTypes.string,
    field: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any
  };

  public static defaultProps = {
    canSort: false
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}


