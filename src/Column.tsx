import * as React from 'react';
import { SortDirections } from './SortDirection';

export type ColumnProps = {
  canSort?: boolean;
  sortDirection?: SortDirections;
  name?: string;
  format?: (data) => any;
  field?: string;
  cell?: any;
  header?: any;
  width?: number|string;
  index?: number;
};

export default class Column extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    canSort: React.PropTypes.bool,
    name: React.PropTypes.string,
    field: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any,
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    index: React.PropTypes.number
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


