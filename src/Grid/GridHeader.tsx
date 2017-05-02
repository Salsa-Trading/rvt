import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Field } from '../List/Field';
import { FieldSet } from '../List/FieldSet';
import { ListViewProps } from '../List';
import GridHeaderCell from './GridHeaderCell';
import ColumnChooser from './ColumnChooser';
import ColumnChooserButton from './ColumnChooserButton';
import safeMouseMove from '../utils/saveMouseMove';
import { RowData } from './GridRow';

const hoverClassName = 'field-moving-hover';
const movingClassName = 'field-moving';

export default class GridHeader extends React.Component<ListViewProps & {
  pinnedRows?: RowData[];
  gridRow?: React.ComponentClass<any>|React.StatelessComponent<any>|React.ReactElement<any>;
}, {
  showColumnChooser: boolean;
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
      showColumnChooser: false
    };
  }

  @autobind
  private onFieldMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const { onMove } = this.props;
    const rootFieldSet = this.props.fieldSet;

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

  private renderHeaderRow(rowIndex: number, rowCount: number, field: Field|FieldSet, colIndex: number, fields: (Field|FieldSet)[]) {
    const { showColumnChooser } = this.state;
    const { fieldSet, onSortSelection, onFilterChanged, onWidthChanged, onHiddenChange } = this.props;

    let colSpan = 1;
    let rowSpan = rowCount - rowIndex;
    if(field instanceof FieldSet) {
      colSpan = field.getCount();
      rowSpan = rowSpan - field.getLevels().length;
    }

    let columnChooser, columnChooserButton;
    if(rowIndex === 0 && colIndex === fields.length - 1) {
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
        canResize={colIndex < fields.length - 1 && ((rowIndex + rowSpan) === rowCount)}
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
    const rows = fieldSet.getLevels();
    return (
      <thead>
        {rows.map((row, r) => {
          return (
            <tr key={r}>
              {row.map(this.renderHeaderRow.bind(this, r, rows.length))}
            </tr>
          );
        })}
        {pinnedRows && this.renderPinnedRows()}
      </thead>
    );
  }
}
