import * as React from 'react';
import { Column, SortDirection } from './Column';
import GridHeaderCell from './GridHeaderCell';
import safeMouseMove from './utils/saveMouseMove';

export type GridHeaderType = React.ComponentClass<GridHeaderProps>|React.StatelessComponent<GridHeaderProps>;

export type GridHeaderProps = {
  columns: Column[];
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
    const { columns } = this.props;
    return columns[index];
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

  public render() {
    const { onSortSelection, onFilterChanged, onWidthChanged } = this.props;
    const { columns } = this.props;

    console.log(columns);

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
              onMouseDown={this.onColumnMouseDown.bind(this)}
            />;
          })}
        </tr>
      </thead>
    );
  }
}
