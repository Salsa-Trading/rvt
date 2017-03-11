import * as React from 'react';
import { ColumnProps } from './Column';
import GridHeaderCell from './GridHeaderCell';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export class GridHeader extends React.Component<{
  onSortSelection: any;
  onMove: (previousIndex: number, newIndex: number) => void;
  onWidthChanged: (width: number, column: any) => void;
  columns: ColumnProps[];
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func,
    onMove: React.PropTypes.func,
    onWidthChanged: React.PropTypes.func,
    columns: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    const { onSortSelection, onWidthChanged, onMove } = this.props;
    const { columns } = this.props;

    return (
      <thead>
        <tr>
          {columns.map((column) => {
            return <GridHeaderCell
              key={column.name}
              column={column}
              onSortSelection={onSortSelection}
              onWidthChanged={onWidthChanged}
              onMove={onMove} />;
            })}
        </tr>
      </thead>
    );
  }
}

export default DragDropContext(HTML5Backend)(GridHeader);
