import * as React from 'react';
import { Column, SortDirection, ColumnGroup } from './List/Column';
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

const hoverClassName = 'column-moving-hover';
const movingClassName = 'column-moving';

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

  private findColumnIndex(tableRow: HTMLTableRowElement, tableHeader: HTMLTableHeaderCellElement, group: string) {
    let index = 0;
    for(let i = 0; i < tableRow.children.length; i++) {
      let item = tableRow.children.item(i) as any;
      if(item.dataset['group'] === group) {
        if(item === tableHeader) {
          return index;
        }
        index++;
      }
    }
    return -1;
  }

  private onColumnMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const { onMove, columnGroup } = this.props;

    e.persist();
    const target = e.currentTarget;
    const tr = e.currentTarget.closest('tr') as HTMLTableRowElement;
    const th = target.closest('th') as HTMLTableHeaderCellElement;
    const group = th.dataset['group'];

    const parentGroup = columnGroup.findColumnGroupByField(group);
    const column = parentGroup.getColumnIndex(this.findColumnIndex(tr, th, group));

    tr.classList.add(movingClassName);
    let currentHover: HTMLTableHeaderCellElement;

    safeMouseMove<HTMLTableHeaderCellElement>(e,
      (moveEvent) => {
        const over = (moveEvent.target as any).closest(`th[data-group=${group}]`) as HTMLTableHeaderCellElement;
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
            const newIndex = this.findColumnIndex(tr, currentHover, group);
            onMove(newIndex, column);
          }
        }
      }
    );
  }

  private renderHeaderRow(rowSpan: number, column: Column|ColumnGroup, c: number) {
    const { columnGroup } = this.props;
    const { onSortSelection, onFilterChanged, onWidthChanged } = this.props;
    let colSpan = 1;
    if(column instanceof ColumnGroup) {
      colSpan = column.getCount();
      rowSpan = rowSpan - column.getCount();
    }
    return <GridHeaderCell
      key={column.field}
      column={column}
      columnGroup={columnGroup.findColumnGroup(column)}
      colSpan={colSpan}
      rowSpan={rowSpan}
      onSortSelection={onSortSelection}
      onFilterChanged={onFilterChanged}
      onWidthChanged={onWidthChanged}
      onMouseDown={this.onColumnMouseDown.bind(this)}
    />;
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
