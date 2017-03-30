import * as React from 'react';
import Filter from './Filter';
import { Column, SortDirection } from './Column';
import safeMouseMove from './utils/saveMouseMove';

export type GridHeaderCellProps = {
  column: Column;
  index: number;
  onSortSelection?: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged?: (filter: any, column: Column) => void;
  onWidthChanged?: (width: number, column: Column) => void;
  onMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>);
};

export default class GridHeaderCell extends React.Component<GridHeaderCellProps, {}> {

  public static propTypes = {
    column: React.PropTypes.any,
    index: React.PropTypes.number,
    onSortSelection: React.PropTypes.func,
    onWidthChanged: React.PropTypes.func,
    onFilterChanged: React.PropTypes.func
  };

  private onResizeHandleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if(e.button !== 0) {
      return;
    }
    e.stopPropagation();

    const { onWidthChanged } = this.props;

    if(!onWidthChanged) {
      return;
    }

    let startingWidth;
    if(typeof this.props.column.width === 'number') {
      startingWidth = this.props.column.width;
    }
    else {
      startingWidth = e.currentTarget.closest('th').clientWidth;
    }

    let startingX = e.pageX;
    safeMouseMove<HTMLDivElement>(e,
      moveEvent => onWidthChanged(startingWidth + (moveEvent.pageX - startingX), this.props.column)
    );
  }

  private onSortClick(sortDirection: SortDirection, e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { onSortSelection, column } = this.props;
    if(onSortSelection) {
      onSortSelection(sortDirection, column);
    }
  }

  private onSortMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  public render() {
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
      onMouseDown
    } = this.props as any;

    const sortSelectionHandler = d => onSortSelection ? onSortSelection(d, column) : null;
    const filterChangedHandler = f => onFilterChanged ? onFilterChanged(f, column) : null;

    let sortFilterControl;
    if(filterable) {
      sortFilterControl = <Filter column={column} onSortSelection={sortSelectionHandler} onFilterChanged={filterChangedHandler} />;
    }
    else if(sortable) {
      sortFilterControl = (
        <div>
          <span className='fa fa-sort-asc' onClick={this.onSortClick.bind(this, 'asc')} onMouseDown={this.onSortMouseDown.bind(this)} />
          <span className='fa fa-sort-desc' onClick={this.onSortClick.bind(this, 'desc')} onMouseDown={this.onSortMouseDown.bind(this)} />
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

    return (
      <th key={field} style={{width, padding: 0}} onMouseDown={onMouseDown}>
        <div className={`grid-header-cell ${headerClassName}`}>
          <div className='header'>
            {header}
          </div>
          <div className='sort-filter'>
            {sortFilterControl}
          </div>
          <div className='resize-handle' onMouseDown={this.onResizeHandleMouseDown.bind(this)} />
        </div>
      </th>
    );
  }

}

