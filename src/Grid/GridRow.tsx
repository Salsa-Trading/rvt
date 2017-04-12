import * as React from 'react';
import { Field } from '../List/Field';
import * as get from 'lodash.get';
import isNil from '../utils/isNil';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export default class GridRow extends React.Component<{
  fields: Field[];
  data?: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
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
      return React.createElement(field.cell as any, {field, data});
    }
    else if(field.format) {
      return field.format(data, field);
    }
    else {
      const value = get(data, field.name);
      return isNil(value) ? value : value.toString();
    }
  }

  private onMouseEvent(eventHandler: VirtualGridMouseEventHandler, e: React.MouseEvent<any>) {
    const { data } = this.props;
    const td = (e.target as any).closest('td');
    eventHandler(e, data, td.dataset['field']);
  }

  public render() {
    const { data, fields, rowProps, onClick, onMouseDown } = this.props;

    return (
      <tr onClick={onClick && this.onMouseEvent.bind(this, onClick)} onMouseDown={onMouseDown  && this.onMouseEvent.bind(this, onMouseDown)} {...rowProps}>
        {(fields || []).map(field => {
          const dataSet = {'data-field': field.name};
          return (
            <td key={field.name} style={{width: field.width}} {...dataSet}>
              {this.renderTableCell(field, data)}
            </td>
          );
        })}
      </tr>
    );
  }
}
