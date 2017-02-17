import * as React from 'react';
import GridHeaderCell from './GridHeaderCell';

export default class GridHeader extends React.Component<{
  onSortSelection: any;
  onWidthChanged: (width: number, column: any) => void;
  columns: any;
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func,
    columns: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    const { onSortSelection, onWidthChanged } = this.props;
    const columns = this.props.columns || [];

    return (
      <thead>
        <tr>
          {columns.map((column, i) => <GridHeaderCell key={i} column={column} onSortSelection={onSortSelection} onWidthChanged={onWidthChanged} />) }
        </tr>
      </thead>
    );
  }
}
