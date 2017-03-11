import * as React from 'react';
import { ColumnProps } from './Column';
import Cell from './Cell';

export default class GridRow extends React.Component<{
  columns: ColumnProps[];
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

  public render() {
    const { data, columns, className } = this.props;
    return (
      <tr className={className}>
        {(columns || []).map((column, i) => {
          // const cellProps = Object.assign({}, column, column.cell ? column.cell.props : {}, {data, width: column.width});
          // delete cellProps.canSort;
          // delete cellProps.sortDirection;
          return <Cell key={column.name} column={column} data={data} />;
        })}
      </tr>
    );
  }
}
