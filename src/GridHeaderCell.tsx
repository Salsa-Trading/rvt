import * as React from 'react';
import { findDOMNode } from 'react-dom';
import Filter from './Filter';
import { Column, SortDirection } from './Column';
import { DragSource, DropTarget } from 'react-dnd';

const columnSource = {
  beginDrag(props) {
    return {
      column: props.column,
      index: props.column.index
    };
  }
};

const columnTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const column = monitor.getItem().column;
    const hoverIndex = props.column.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the onMove when the mouse has crossed half of the items height
    // When dragging downwards, only onMove when the cursor is below 50%
    // When dragging upwards, only onMove when the cursor is above 50%

    // Dragging right
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging left
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    // Time to actually perform the action
    props.onMove(column, dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@DropTarget('COLUMN', columnTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource('COLUMN', columnSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging
}))
export default class GridHeaderCell extends React.Component<{
  column: Column;
  onSortSelection: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged: (filter: any, column: Column) => void;
  onWidthChanged: (width: number, column: Column) => void;
  onMove?: (oldIndex: number, newIndex: number) => void;
  confirmDrop?: any;
  cancelDrop?: any;
  isDragging?: boolean;
  connectDropTarget?: any;
  connectDragSource?: any;
  connectDragPreview?: any;
}, {}> {

  // public static propTypes = {
  //   onSortSelection: React.PropTypes.func,
  //   onWidthChanged: React.PropTypes.func,
  //   column: React.PropTypes.any
  // };

  public render() {
    let headerElement;

    const onResizeHandleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if(e.button !== 0) {
        return;
      }
      const { onWidthChanged } = this.props;

      if(!onWidthChanged) {
        return;
      }

      let startingWidth;
      if(typeof this.props.column.width === 'number') {
        startingWidth = this.props.column.width;
      }
      else {
        startingWidth = findDOMNode(headerElement).clientWidth;
      }

      let startingX = e.pageX;

      const onMouseMove = (moveEvent: React.MouseEvent<HTMLDivElement>) => {
        onWidthChanged(startingWidth + (moveEvent.pageX - startingX), this.props.column);
        moveEvent.preventDefault();
      };

      const onMouseUp = (upEvent: React.MouseEvent<HTMLDivElement>) => {
        document.removeEventListener('mousemove', onMouseMove as any);
        document.removeEventListener('mouseup', onMouseUp as any);
        upEvent.preventDefault();
      };

      document.addEventListener('mousemove', onMouseMove as any);
      document.addEventListener('mouseup', onMouseUp as any);
      e.preventDefault();
    };

    const {
      column,
      column: {
        header,
        field,
        width,
        sortable,
        filterable
      },
      onSortSelection,
      onFilterChanged,
      connectDragSource,
      connectDropTarget,
      connectDragPreview
    } = this.props as any;

    const sortSelectionHandler = d => onSortSelection ? onSortSelection(d, this.props.column) : null;
    const filterChangedHandler = f => onFilterChanged ? onFilterChanged(f, this.props.column) : null;

    const headerRef = (r) => headerElement = r;
    let sortFilterControl;
    if(filterable) {
      sortFilterControl = <Filter column={column} onSortSelection={sortSelectionHandler} onFilterChanged={filterChangedHandler} />;
    }
    else if(sortable) {
      sortFilterControl = (
        <div>
          <span className='fa fa-sort-asc' onClick={() => sortSelectionHandler('asc')} />
          <span className='fa fa-sort-desc' onClick={() => sortSelectionHandler('desc')} />
        </div>
      );
    }

    let headerClassName;
    if(column.sortDirection) {
      headerClassName = `sorted-${column.sortDirection}`;
    }
    else if(column.sortable) {
      headerClassName = 'sortable';
    }

    return connectDragPreview(connectDropTarget(
      <th key={field} ref={headerRef} style={{width, padding: 0}}>
        <div className={`grid-header-cell ${headerClassName}`}>
          {connectDragSource(
            <div className='header'>
              {header}
            </div>
          )}
          <div className='sort-filter'>
            {sortFilterControl}
          </div>
          <div className='resize-handle' onMouseDown={onResizeHandleMouseDown} />
        </div>
      </th>
    ));
  }


}

