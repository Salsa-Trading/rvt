import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Field } from '../List/Field';
import * as get from 'lodash.get';
import isNil from '../utils/isNil';
import { TableRowProps } from '../VirtualTable';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export type GridRowProps<TData> = {
  data: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export default class GridRow<TData> extends React.Component<{
  fields: Field[];
  data?: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
}, {}> {

  public static propTypes = {
    fields: PropTypes.any,
    data: PropTypes.any,
    className: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
  }

  private renderTableCell(field: Field, data: TData) {
    if(field.cell) {
      if(React.isValidElement(field.cell)) {
        return React.cloneElement(field.cell as any, {field, data});
      }
      else {
        return React.createElement(field.cell as any, {field, data});
      }
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
    const { data, fields, rowProps, onClick, onDoubleClick, onMouseDown } = this.props;

    return (
      <tr
        onClick={onClick && this.onMouseEvent.bind(this, onClick)}
        onDoubleClick={onDoubleClick && this.onMouseEvent.bind(this, onDoubleClick)}
        onMouseDown={onMouseDown && this.onMouseEvent.bind(this, onMouseDown)}
        {...rowProps}
      >
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
