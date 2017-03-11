import * as React from 'react';
import { ColumnProps } from './Column';
import { get } from 'lodash';

export default class Cell extends React.Component<{
  column: ColumnProps;
  data?: any;
}, {}> {

  public render() {
    const { column, data } = this.props;
    let value;
    if (column.format) {
      value = column.format(data);
    }
    else {
      value = get(data, column.field);
    }

    return (
      <td width={column.width}>
        {value}
      </td>
    );
  }
}
