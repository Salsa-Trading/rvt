import * as React from 'react';
import { Column, SortDirection } from './Column';
import GridHeaderCell from './GridHeaderCell';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export type GridHeaderType = React.ComponentClass<GridHeaderProps>|React.StatelessComponent<GridHeaderProps>;

export type GridHeaderProps = {
  columns: Column[];
  onSortSelection?: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged?: (filter: any, column: Column) => void;
  onWidthChanged?: (width: number, column: Column) => void;
  onMove?: (newIndex: number, column: Column) => void;
};

export class GridHeader extends React.Component<GridHeaderProps, {}> {

  public static propTypes = {
    columns: React.PropTypes.any,
    onSortSelection: React.PropTypes.func,
    onFilterChanged: React.PropTypes.func,
    onWidthChanged: React.PropTypes.func,
    onMove: React.PropTypes.func
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
          {columns.map((column, i) => {
            return <GridHeaderCell
              key={column.field}
              column={column}
              index={i}
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

export default DragDropContext(HTML5Backend)(GridHeader) as GridHeaderType;
