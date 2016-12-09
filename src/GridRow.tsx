import * as React from 'react';
import { get } from 'lodash';

export default class GridRow extends React.Component<{
  columns: any;
  rowData?: any;
}, {}> {

  public static propTypes = {
    columns: React.PropTypes.any,
    rowData: React.PropTypes.any
  };

  private renderFunctions: any;

  constructor(props, context) {
    super(props, context);
    this.buildRenderFunctions(this.props.columns);
  }

  private buildRenderFunctions(columns): any {
    this.renderFunctions = columns.map(column => {
      if (column.cell && column.cell.props && column.cell.props.format) {
        return (data) => column.cell.props.format(data);
      }
      return (data) => get(data, column.props.field).toString();
    });
  }

  public render() {
    const data = this.props.rowData ? this.props.rowData.data : null;
    const columns = this.props.columns || [];
    return (
      <tr className={this.props.rowData.className}>
        {columns.map((c, i) => {
          const cellProps = Object.assign({}, c.cell ? c.cell.props : {}, {width: c.props.width});
          delete cellProps.format;
          return (
            <td key={i} {...cellProps}>
              {this.renderFunctions[i](data)}
            </td>
            );
        })}
      </tr>
    );
  }
}
