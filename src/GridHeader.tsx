import * as React from 'react';
import { Field, SortDirection } from './List/Field';
import { FieldSet } from './List/FieldSet';
import GridHeaderCell from './GridHeaderCell';
import safeMouseMove from './utils/saveMouseMove';

export type GridHeaderType = React.ComponentClass<GridHeaderProps>|React.StatelessComponent<GridHeaderProps>;

export type GridHeaderProps = {
  fieldSet: FieldSet,
  onSortSelection?: (sortDirection: SortDirection, field: Field) => void;
  onFilterChanged?: (filter: any, field: Field) => void;
  onWidthChanged?: (width: number, field: Field) => void;
  onMove?: (newIndex: number, field: Field) => void;
};

const hoverClassName = 'field-moving-hover';
const movingClassName = 'field-moving';

export default class GridHeader extends React.Component<GridHeaderProps, {}> {

  public static propTypes = {
    fieldSet: React.PropTypes.any,
    onSortSelection: React.PropTypes.func,
    onFilterChanged: React.PropTypes.func,
    onWidthChanged: React.PropTypes.func,
    onMove: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
  }

  private findFieldIndex(tableRow: HTMLTableRowElement, tableHeader: HTMLTableHeaderCellElement, group: string) {
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

  private onFieldMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const { onMove, fieldSet } = this.props;

    e.persist();
    const target = e.currentTarget;
    const tr = e.currentTarget.closest('tr') as HTMLTableRowElement;
    const th = target.closest('th') as HTMLTableHeaderCellElement;
    const group = th.dataset['group'];

    const parentGroup = fieldSet.findFieldSetByField(group);
    const field = parentGroup.getFieldIndex(this.findFieldIndex(tr, th, group));

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
            const newIndex = this.findFieldIndex(tr, currentHover, group);
            onMove(newIndex, field);
          }
        }
      }
    );
  }

  private renderHeaderRow(rowSpan: number, field: Field|FieldSet, c: number) {
    const { fieldSet } = this.props;
    const { onSortSelection, onFilterChanged, onWidthChanged } = this.props;
    let colSpan = 1;
    if(field instanceof FieldSet) {
      colSpan = field.getCount();
      rowSpan = rowSpan - field.getCount();
    }
    return <GridHeaderCell
      key={field.field}
      field={field}
      fieldSet={fieldSet.findFieldSet(field)}
      colSpan={colSpan}
      rowSpan={rowSpan}
      onSortSelection={onSortSelection}
      onFilterChanged={onFilterChanged}
      onWidthChanged={onWidthChanged}
      onMouseDown={this.onFieldMouseDown.bind(this)}
    />;
  }

  public render() {
    const { fieldSet } = this.props;
    const rows = fieldSet.getLevels();
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
