import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Field, FieldBase } from '../List/Field';
import { FieldSet, isVisible } from '../List/FieldSet';
import { ListViewProps } from '../List';
import GridHeaderCell from './GridHeaderCell';
import ColumnChooser from './ColumnChooser';
import ColumnChooserButton from './ColumnChooserButton';
import safeMouseMove from '../utils/saveMouseMove';
import { GridRowProps } from './GridRow';

const hoverClassName = 'field-moving-hover';
const movingClassName = 'field-moving';

export type FieldHeader = {
  field: FieldBase;
  rowSpan: number;
  colSpan: number;
};

export function fillLevels(fieldSet: FieldSet, rows: number): FieldHeader[][] {
  const level: FieldHeader[] = [];
  const levels = [level];
  for(let child of fieldSet.children.filter(f => isVisible(f))) {
    if(child instanceof FieldSet) {
      level.push({field: child, colSpan: child.getFieldCount(), rowSpan: 1});
      let subLevels = fillLevels(child, rows - 1);
      for(let i = 0; i < subLevels.length; i++) {
        if(subLevels[i] && subLevels[i].length > 0) {
          levels[i + 1] = (levels[i + 1] || []).concat(subLevels[i]);
        }
      }
    }
    else if(child instanceof Field) {
      level.push({field: child, colSpan: 1, rowSpan: Math.max(rows, 1)});
    }
  }
  return levels;
}

export function getLevels(fieldSet: FieldSet): FieldHeader[][] {
  const maxRows = fieldSet.getLevelCount();
  return fillLevels(fieldSet, maxRows);
}

export default class GridHeader<TData> extends React.Component<ListViewProps & {
  pinnedRows?: GridRowProps<TData>[];
  gridRow?: React.ComponentClass<any>|React.StatelessComponent<any>|React.ReactElement<any>;
}, {
  showColumnChooser: boolean;
  draggingColumn: boolean;
}> {

  public static propTypes = {
    fieldSet: PropTypes.any.isRequired,
    onSortSelection: PropTypes.func,
    onFilterChanged: PropTypes.func,
    onWidthChanged: PropTypes.func,
    onMove: PropTypes.func,
    onHiddenChange: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      showColumnChooser: false,
      draggingColumn: false
    };
  }

  @autobind
  private onFieldMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const { onMove } = this.props;
    const rootFieldSet = this.props.fieldSet;

    this.setState({draggingColumn: true});

    e.persist();
    const target = e.currentTarget;
    const tr = e.currentTarget.closest('tr') as HTMLTableRowElement;
    const th = target.closest('th') as HTMLTableHeaderCellElement;
    const group = th.dataset['group'];
    const fieldName = th.dataset['field'];

    const field = rootFieldSet.findFieldByName(fieldName);

    tr.classList.add(movingClassName);
    let currentHover: HTMLTableHeaderCellElement;

    safeMouseMove<HTMLTableHeaderCellElement>(e,
      (moveEvent) => {
        const over = (moveEvent.target as any).closest(`th[data-group="${group}"]`) as HTMLTableHeaderCellElement;
        if(currentHover && over !== currentHover) {
          currentHover.classList.remove(hoverClassName);
        }
        if(over && over !== target) {
          over.classList.add(hoverClassName);
          currentHover = over;
        }
      },
      () => {
        this.setState({draggingColumn: false});
        if(onMove) {
          tr.classList.remove(movingClassName);
          if(currentHover) {
            currentHover.classList.remove(hoverClassName);
            const hoverFieldName = currentHover.dataset['field'];
            const hoverField = rootFieldSet.findFieldByName(hoverFieldName);
            const parentFieldSet = rootFieldSet.findParent(hoverField);
            onMove(parentFieldSet.findFieldIndex(hoverField) , field);
          }
        }
      }
    );
  }

  @autobind
  private onToggleColumnChooserVisibility(isVisible: boolean) {
    this.setState({showColumnChooser: isVisible});
  }

  private renderHeaderRow(rowCount: number, colCount: number, rowIndex: number, fieldHeader: FieldHeader, colIndex: number, fieldHeadersOnRow: FieldHeader[]) {
    const { showColumnChooser } = this.state;
    const { field, colSpan, rowSpan } = fieldHeader;
    const { fieldSet, onSortSelection, onFilterChanged, onWidthChanged, onHiddenChange } = this.props;
    let columnChooser, columnChooserButton;

    const isFirstRow = rowIndex === 0;
    const isLastRow = ((rowIndex + rowSpan) === rowCount);

    let colSum = 0;
    for(let i = 0; i <= colIndex; i++) {
      colSum += fieldHeadersOnRow[i].colSpan;
    }
    let isLastCol = colSum === colCount;

    // place ColumnChooser in the last column of the first row
    if(isFirstRow && isLastCol) {
      columnChooser = (
        <ColumnChooser
          fieldSet={fieldSet}
          onHiddenChange={onHiddenChange}
          onToggleVisibility={this.onToggleColumnChooserVisibility}
        />
      );
      columnChooserButton = (
        <ColumnChooserButton
          columnChooser={columnChooser}
          onToggleVisibility={this.onToggleColumnChooserVisibility}
          showColumnChooser={showColumnChooser}
        />
      );
    }

    return (
      <GridHeaderCell
        key={field.name}
        field={field}
        fieldSet={fieldSet.findParent(field)}
        colSpan={colSpan}
        rowSpan={rowSpan}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMouseDown={this.onFieldMouseDown}
        canResize={isLastRow && !isLastCol}
        columnChooserButton={columnChooserButton}
      />
    );
  }

  public renderPinnedRows() {
    const { pinnedRows, gridRow } = this.props;

    const rowElement = React.isValidElement(gridRow) ? gridRow : React.createElement(gridRow as any);
    return pinnedRows.map((r, i) => React.cloneElement(rowElement as any, {...r, key: i}));
  }

  public render() {
    const { fieldSet, pinnedRows } = this.props;
    const rows = getLevels(fieldSet);
    const colCount = rows[0].reduce((r, i) => r + i.colSpan, 0);
    const className = this.state.draggingColumn ? 'dragging' : null;
    return (
      <thead className={className}>
        {rows.map((row: FieldHeader[], r: number) => {
          return (
            <tr key={r}>
              {row.map(this.renderHeaderRow.bind(this, rows.length, colCount, r))}
            </tr>
          );
        })}
        {pinnedRows && this.renderPinnedRows()}
      </thead>
    );
  }
}
