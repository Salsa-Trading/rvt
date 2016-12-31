import * as React from 'react';
import { get } from 'lodash';

export default class Cell extends React.Component<{
  format?: (data: any) => string;
  field?: string;
  data?: any;
}, {}> {

  public render() {
    const { format, field, data, ...rest } = this.props;
    let value;
    if (format) {
      value = format(data);
    }
    else {
      value = get(data, field);
    }

    return (
      <td {...rest}>
        {value}
      </td>
    );
  }
}
