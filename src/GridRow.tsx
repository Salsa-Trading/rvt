import * as React from 'react';
import { Field } from './List/Field';
import { get } from 'lodash';

export default class GridRow extends React.Component<{
  fields: Field[];
  data?: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
}, {}> {

  public static propTypes = {
    fields: React.PropTypes.any,
    data: React.PropTypes.any,
    className: React.PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
  }

  private renderTableCell(field: Field, data: any) {
    if(field.cell) {
      return field.cell(data);
    }
    else {
      return get(data, field.field);
    }
  }

  public render() {
    const { data, fields, rowProps } = this.props;
    return (
      <tr {...rowProps} >
        {(fields || []).map((field) => (
          <td key={field.field} style={{width: field.width}}>
            {this.renderTableCell(field, data)}
          </td>
        ))}
      </tr>
    );
  }
}
