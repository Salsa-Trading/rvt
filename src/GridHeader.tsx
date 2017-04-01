import * as React from 'react';
import { Column, SortDirection, ColumnGroup } from './Column';
import GridHeaderCell from './GridHeaderCell';
import safeMouseMove from './utils/saveMouseMove';

export type GridHeaderType = React.ComponentClass<GridHeaderProps>|React.StatelessComponent<GridHeaderProps>;

export type GridHeaderProps = {
  columnGroup: ColumnGroup,
  onSortSelection?: (sortDirection: SortDirection, column: Column) => void;
  onFilterChanged?: (filter: any, column: Column) => void;
  onWidthChanged?: (width: number, column: Column) => void;
  onMove?: (newIndex: number, column: Column) => void;
};

export default class GridHeader extends React.Component<GridHeaderProps, {}> {

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

  private columAtIndex(index: number) {
    const { columnGroup } = this.props;
    return columnGroup.getColumnIndex(index);
  }

  private findColumnIndex(tableRow: HTMLTableRowElement, tableHeader: HTMLTableHeaderCellElement) {
    for(let i = 0; i < tableRow.children.length; i++) {
      if(tableRow.children.item(i) === tableHeader) {
        return i;
      }
    }
    return -1;
  }

  private onColumnMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const hoverClassName = 'column-moving-hover';
    const movingClassName = 'column-moving';
    const { onMove } = this.props;
    e.persist();
    const target = e.currentTarget;
    const tr = e.currentTarget.closest('tr') as HTMLTableRowElement;
    const column = this.columAtIndex(this.findColumnIndex(tr, target.closest('th') as HTMLTableHeaderCellElement));

    tr.classList.add(movingClassName);
    let currentHover: HTMLTableHeaderCellElement;

    safeMouseMove<HTMLTableHeaderCellElement>(e,
      (moveEvent) => {
        const over = (moveEvent.target as any).closest('th') as HTMLTableHeaderCellElement;
        if(currentHover && over !== currentHover) {
          currentHover.classList.remove(hoverClassName);
        }
        if(over && over !== target) {
          over.classList.add(hoverClassName);
          currentHover = over;
        }
      },
      () => {
        if(onMove) {
          tr.classList.remove(movingClassName);
          if(currentHover) {
            currentHover.classList.remove(hoverClassName);
            const newIndex = this.findColumnIndex(tr, currentHover);
            onMove(newIndex, column);
          }
        }
      }
    );
  }

  private renderHeaderRow(rowSpan: number, column: Column|ColumnGroup, c: number) {
    const { onSortSelection, onFilterChanged, onWidthChanged } = this.props;
    if(column instanceof ColumnGroup) {
      return <th
        key={column.field}
        colSpan={column.getCount()}
        rowSpan={rowSpan - column.getCount()}
        >{column.header}</th>;
    }
    else if(column instanceof Column) {
      return <GridHeaderCell
        key={column.field}
        column={column}
        rowSpan={rowSpan}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMouseDown={this.onColumnMouseDown.bind(this)}
      />;
    }
  }


  public render() {
    const { columnGroup } = this.props;
    const rows = columnGroup.getLevels();
    return (
      <thead>
        {rows.map((row, r) => {
          return (
            <tr key={r}>
              {row.map(this.renderHeaderRow.bind(this, rows.length - r))}
            </tr>
          );
        })}
      </thead>
    );
  }
}
