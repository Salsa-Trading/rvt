import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Field } from '../List/Field';
import * as get from 'lodash.get';
import { isEqual } from 'lodash';
import isNil from '../utils/isNil';
import { TableRowProps } from '../VirtualTable';
import {GridRowProps, GridRowComponentProps, VirtualGridMouseEventHandler} from './types';
import { autobind } from 'core-decorators';

export function renderGridCell<TData>(field: Field, data: TData) {
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

export default class GridRow<TData> extends React.Component<GridRowComponentProps<TData>, {}> {

  public static propTypes = {
    fields: PropTypes.any,
    data: PropTypes.any,
    className: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }

  @autobind
  private onMouseEvent(eventHandler: VirtualGridMouseEventHandler, e: React.MouseEvent<any>) {
    const { data } = this.props;
    const td = (e.target as any).closest('td');
    eventHandler(e, data, td.dataset['field']);
  }

  @autobind
  private fieldForMouseEvent(e: React.MouseEvent<any>): string {
    const td = (e.target as any).closest('td');
    return td.dataset['field'];
  }

  @autobind
  private onClick(e: React.MouseEvent<any>) {
    const { onClick, data } = this.props;
    onClick(e, data, this.fieldForMouseEvent(e));
  }

  @autobind
  private onDoubleClick(e: React.MouseEvent<any>) {
    const { onDoubleClick, data } = this.props;
    onDoubleClick(e, data, this.fieldForMouseEvent(e));
  }

  @autobind
  private onMouseDown(e: React.MouseEvent<any>) {
    const { onMouseDown, data } = this.props;
    onMouseDown(e, data, this.fieldForMouseEvent(e));
  }

  public render() {
    const { data, fields, rowProps, onClick, onDoubleClick, onMouseDown } = this.props;

    return (
      <tr
        onClick={onClick && this.onClick}
        onDoubleClick={onDoubleClick && this.onDoubleClick}
        onMouseDown={onMouseDown && this.onMouseDown}
        {...rowProps}
      >
        {(fields || []).map(field => {
          const dataSet = {'data-field': field.name};
          return (
            <td key={field.name} style={{width: field.width}} {...dataSet}>
              {renderGridCell(field, data)}
            </td>
          );
        })}
      </tr>
    );
  }
}
