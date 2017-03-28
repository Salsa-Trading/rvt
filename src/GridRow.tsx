import * as React from 'react';
import { Column } from './Column';
import { get } from 'lodash';

export default class GridRow extends React.Component<{
  columns: Column[];
  data?: any;
  className?: string;
}, {}> {

  public static propTypes = {
    columns: React.PropTypes.any,
    data: React.PropTypes.any,
    className: React.PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
  }

  private renderTableCell(column: Column, data: any) {
    if(column.cell) {
      return column.cell(data);
    }
    else {
      return get(data, column.field);
    }
  }

  public render() {
    const { data, columns, className } = this.props;
    return (
      <tr className={className}>
        {(columns || []).map((column) => (
          <td key={column.field} style={{width: column.width}}>
            {this.renderTableCell(column, data)}
          </td>
        ))}
      </tr>
    );
  }
}
