import * as React from 'react';
import * as PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { GridRowComponentProps, VirtualGridMouseEventHandler } from './types';
import { autobind } from 'core-decorators';
import { renderGridCell, renderGridRowHeader } from './helpers';

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
    const shouldRender = !isEqual(this.props, nextProps);
    return shouldRender;
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
    const { data, fields, rowProps, onClick, onDoubleClick, onMouseDown, rowHeaderComponent } = this.props;

    return (
      <tr
        onClick={onClick && this.onClick}
        onDoubleClick={onDoubleClick && this.onDoubleClick}
        onMouseDown={onMouseDown && this.onMouseDown}
        {...rowProps}
      >
        {renderGridRowHeader(rowHeaderComponent, data)}
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
