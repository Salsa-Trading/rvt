import * as React from 'react';
import Filter from './Filter';
import { Column, SortDirection, ColumnGroup } from './List/Column';
import safeMouseMove from './utils/saveMouseMove';

export type GridHeaderCellProps = {
  column: Column;
  columnGroup: ColumnGroup;
  rowSpan?: number;
  colSpan?: number;
  onSortSelection?: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged?: (filter: any, column: Column) => void;
  onWidthChanged?: (width: number, column: Column) => void;
  onMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>);
};

export default class GridHeaderCell extends React.Component<GridHeaderCellProps, {}> {

  public static propTypes = {
    column: React.PropTypes.any,
    columnGroup: React.PropTypes.any,
    rowSpan: React.PropTypes.number,
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

  private sortBtn(sortDirection: SortDirection): React.ReactElement<any> {
    const { column } = this.props;
    const classNames = [
      'sort',
      `sort-${sortDirection}`,
      column.sortDirection === sortDirection ? 'sort-active' : 'sort-inactive'
    ].join(' ');

    return <button
      onClick={this.onSortClick.bind(this, sortDirection)}
      className={classNames}
    />;
  }

  public render() {
    const {
      column,
      columnGroup,
      column: {
        header,
        field,
        width,
        sortDirection,
        sortable,
        filterable,
        filter
      },
      rowSpan,
      colSpan,
      onSortSelection,
      onFilterChanged,
      onMouseDown
    } = this.props as any;

    const sortSelectionHandler = d => onSortSelection ? onSortSelection(d, column) : null;
    const filterChangedHandler = f => onFilterChanged ? onFilterChanged(f, column) : null;

    const headerClassName = [
      'grid-header-cell',
      sortable ? 'sortable' : null,
      sortable && sortDirection ? `sorted sorted-${column.sortDirection}` : null,
      filterable ? 'filterable' : null,
      filterable && filter ? 'filtered' : null
    ].join(' ');
    let sortFilterControl;
    if(filterable) {
      sortFilterControl = <Filter column={column} onSortSelection={sortSelectionHandler} onFilterChanged={filterChangedHandler} />;
    }
    else if(sortable) {
      sortFilterControl = (
        <div>
          {this.sortBtn(SortDirection.asc)}
          {this.sortBtn(SortDirection.desc)}
        </div>
      );
    }
    const dataSet = {'data-group': columnGroup.field};

    return (
      <th key={field} style={{width, padding: 0}} rowSpan={rowSpan} colSpan={colSpan} {...dataSet}>
        <div className={`${headerClassName}`}>
          <div className='header' onMouseDown={onMouseDown}>
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
