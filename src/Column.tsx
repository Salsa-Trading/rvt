import * as React from 'react';
import Header from './Header';
import Cell from './Cell';

export type ColumnProps = {
  canSort: boolean;
  name: string;
  field: string;
}


export default class Column extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    canSort: React.PropTypes.bool,
    name: React.PropTypes.string,
    field: React.PropTypes.string
  };

  public static defaultProps = {
    canSort: false
  };

  private header: any;
  private cell: any;

  constructor(props, context) {
    super(props, context);
    React.Children.forEach(this.props.children, (child: any) => {
      if (child.type === Header) {
        this.header = child;
      }
      if (child.type === Cell) {
        this.cell = child;
      }
    });
  }

  public render() {
    return null;
  }
}


