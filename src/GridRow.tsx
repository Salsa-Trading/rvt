import * as React from 'react';
import Cell from './Cell';

export default class GridRow extends React.Component<{
  columns: any;
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
        {(columns || []).map((c, i) => {
          const cellProps = Object.assign({}, c.props, c.cell ? c.cell.props : {}, {data, width: c.props.width});
          delete cellProps.canSort;
          delete cellProps.sortDirection;
          return <Cell key={i} {...cellProps} />;
        })}
      </tr>
    );
  }
}
