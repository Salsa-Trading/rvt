import * as React from 'react';
import SortDirection, { SortDirections } from './SortDirection';

export type ColumnProps = {
  name?: string;
  format?: (data) => any;
  field?: string;
  cell?: any;
  header?: any;
  width?: number|string;
  index?: number;
  canSort?: boolean;
  sortDirection?: SortDirections;
  canFilter?: boolean;
  filter?: any;
};

export default class Column extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    name: React.PropTypes.string,
    field: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any,
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    index: React.PropTypes.number,
    canSort: React.PropTypes.bool,
    sortDirection: React.PropTypes.oneOf([
      SortDirection.NONE,
      SortDirection.ASCENDING,
      SortDirection.DESCENDING
    ]),
    canFilter: React.PropTypes.bool,
    filter: React.PropTypes.any
  };

  public static defaultProps = {
    canSort: false,
    canFilter: false
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}


