import * as React from 'react';
import { Column, SortDirection } from './Column';
import GridHeaderCell from './GridHeaderCell';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export class GridHeader extends React.Component<{
  columns: Column[];
  onSortSelection: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged: (filter: any, column: Column) => void;
  onWidthChanged: (width: number, column: Column) => void;
  onMove?: (oldIndex: number, newIndex: number) => void;
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
    const { onSortSelection, onFilterChanged, onWidthChanged, onMove } = this.props;
    const { columns } = this.props;

    return (
      <thead>
        <tr>
          {columns.map((column) => {
            return <GridHeaderCell
              key={column.field}
              column={column}
              onSortSelection={onSortSelection}
              onFilterChanged={onFilterChanged}
              onWidthChanged={onWidthChanged}
              onMove={onMove} />;
            })}
        </tr>
      </thead>
    );
  }
}

export default DragDropContext(HTML5Backend)(GridHeader);
