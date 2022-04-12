import * as React from 'react';
import {createPortal} from 'react-dom';
import * as PropTypes from 'prop-types';
import {autobind} from 'core-decorators';
import {isEqual, flatten, debounce, keyBy} from 'lodash';

import {Field} from '../List/Field';
import {FieldSet} from '../List/FieldSet';
import {ListViewProps} from '../List/List';
import GridHeaderCell from './GridHeaderCell';
import ColumnChooser from './ColumnChooser';
import ColumnChooserButton from './ColumnChooserButton';
import safeMouseMove from '../utils/saveMouseMove';
import {GridRowProps, GridRowComponentProps, GridRowHeaderProps, GridSecondaryHeaderProps} from './types';
import {FieldHeader, getLevels, renderGridRowHeader} from './helpers';

const hoverClassName = 'field-moving-hover';
const movingClassName = 'field-moving';

export type GridHeaderProps<TData extends object> = ListViewProps & {
  pinnedRows?: GridRowProps<TData>[];
  gridRow?: React.ComponentType<GridRowComponentProps<TData>>|React.ReactElement<GridRowComponentProps<TData>>;
  rowHeader?: React.ComponentType<GridRowHeaderProps<TData>>;
  secondaryHeader?: React.ComponentType<GridSecondaryHeaderProps>;
  chooserMountPoint?: HTMLElement
  hideDefaultChooser?: boolean;
  fixedColumnWidth?: boolean;
  hideFilters?: boolean;
  hideHeader?: boolean;
};

export default class GridHeader<TData extends object> extends React.Component<GridHeaderProps<TData>, {
  showColumnChooser: boolean;
  draggingColumn: boolean;
}> {

  public static propTypes = {
    fieldSet: PropTypes.any.isRequired,
    onSortSelection: PropTypes.func,
    onHiddenChanged: PropTypes.func,
    onFilterChanged: PropTypes.func,
    onWidthChanged: PropTypes.func,
    onMove: PropTypes.func,
    onHiddenChange: PropTypes.func,
    chooserMountPoint: PropTypes.any,
    hideDefaultChooser: PropTypes.bool,
    hideHeader: PropTypes.bool
  };

  public static defaultProps = {
    hideHeader: false
  };

  private theadRef: HTMLDivElement;
  private readonly debouncedUpdateWidthsAfterChange: () => void;
  private readonly fieldHeaderOnChangeCache: WeakMap<FieldSet | Field, (f: FieldSet | Field) => void> = new WeakMap();

  constructor(props: GridHeaderProps<TData>, context) {
    super(props, context);
    this.state = {
      showColumnChooser: false,
      draggingColumn: false
    };

    this.debouncedUpdateWidthsAfterChange = debounce(this.updateWidthsAfterChange, 200, {leading: false, trailing: true});
    this.fieldHeaderOnChangeCache = new WeakMap();
  }

  public shouldComponentUpdate(nextProps: GridHeaderProps<TData>, nextState) {
    return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
  }

  public componentDidMount() {
    if(!this.props.fixedColumnWidth) {
      this.updateWidthsAfterChange();
    }
  }

  @autobind
  private onFieldMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    const {onMove} = this.props;
    const rootFieldSet = this.props.fieldSet;

    this.setState({draggingColumn: true});

    e.persist();
    const target = e.currentTarget;
    const tr = e.currentTarget.closest('tr');
    const th = target.closest('th');
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
            onMove(parentFieldSet.findFieldIndex(hoverField), field);
          }
        }
      }
    );
  }

  @autobind
  private onToggleColumnChooserVisibility(showColumnChooser: boolean) {
    this.setState({showColumnChooser});
  }

  private renderHeaderRow(rowCount: number, colCount: number, rowIndex: number, fieldHeader: FieldHeader, colIndex: number, fieldHeadersOnRow: FieldHeader[]) {
    const {field, colSpan, rowSpan} = fieldHeader;
    const {fieldSet, onSortSelection, onFilterChanged, onTitleChanged, onHiddenChange, fixedColumnWidth, hideFilters} = this.props;
    const isFirstRow = rowIndex === 0;
    const isLastRow = ((rowIndex + rowSpan) === rowCount);
    if(!this.fieldHeaderOnChangeCache.has(field)) {
      this.fieldHeaderOnChangeCache.set(field, (f) => onHiddenChange(true, f));
    }

    let colSum = 0;
    for(let i = 0; i <= colIndex; i++) {
      colSum += fieldHeadersOnRow[i].colSpan;
    }
    const isLastCol = colSum === colCount;

    // place ColumnChooser in the last column of the first row
    const columnChooserButton = isFirstRow && isLastCol
      ? this.renderColumnChooserButton()
      : null;

    return (
      <GridHeaderCell
        key={field.name}
        field={field}
        fieldSet={fieldSet.findParent(field)}
        colSpan={colSpan}
        rowSpan={rowSpan}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={this.onWidthChangedProxy}
        onTitleChanged={onTitleChanged}
        onHiddenChanged={this.fieldHeaderOnChangeCache.get(field)}
        onMouseDown={this.onFieldMouseDown}
        canResize={fixedColumnWidth || (isLastRow && !isLastCol)}
        columnChooserButton={columnChooserButton}
        hideFilters={hideFilters}
      />
    );
  }

  @autobind
  private onWidthChangedProxy(width: number, field: FieldSet | Field) {
    this.props.onWidthChanged(width, field);
    if(!this.props.fixedColumnWidth) {
      this.debouncedUpdateWidthsAfterChange();
    }
  }

  @autobind
  private updateWidthsAfterChange() {
    const {fieldSet} = this.props;
    if(this.theadRef) {
      const ths = [...this.theadRef.querySelectorAll('th')];
      const updates: [number, Field][] = [];
      const fields = keyBy(flatten(getLevels(fieldSet)).map((fh) => fh.field), 'name');
      ths.forEach((th) => {
        const fieldName = th.dataset.field;
        const field = fields[fieldName];
        if(field instanceof Field) {
          const width = th.clientWidth;
          updates.push([width, field]);
        }
      });

      this.props.onWidthChangedBulk(updates);
    }
  }
  @autobind
  private setRef(ref) {
    this.theadRef = ref;
  }

  private renderColumnChooserButton(): any {
    const {
      props: {
        fieldSet,
        onHiddenChange,
        chooserMountPoint,
        hideDefaultChooser
      },
      state: {
        showColumnChooser
      }
    } = this;

    const columnChooser = (
      <ColumnChooser
        fieldSet={fieldSet}
        onHiddenChange={onHiddenChange}
        onToggleVisibility={this.onToggleColumnChooserVisibility}
      />
    );

    if(chooserMountPoint) {
      return createPortal(columnChooser, chooserMountPoint);
    } else if(!hideDefaultChooser) {
      return (
        <ColumnChooserButton
          columnChooser={columnChooser}
          onToggleVisibility={this.onToggleColumnChooserVisibility}
          showColumnChooser={showColumnChooser}
        />
      );
    }
  }

  public renderPinnedRows() {
    const {pinnedRows, gridRow, secondaryHeader, fieldSet} = this.props;
    let headerRowElements = [];

    if(secondaryHeader) {
      headerRowElements = [
        React.createElement(secondaryHeader, {fields: fieldSet.getFields(), key: 'secondary-header'})
      ];
    }

    if(pinnedRows) {
      const rowElement = React.isValidElement(gridRow) ? gridRow : React.createElement(gridRow as any);
      headerRowElements = [...headerRowElements, ...pinnedRows.map((r, i) => React.cloneElement(rowElement as any, {...r, key: i}))];
    }

    return headerRowElements;
  }

  public render() {
    const {fieldSet, rowHeader, hideHeader} = this.props;
    const rows = getLevels(fieldSet);
    const colCount = rows[0].reduce((r, i) => r + i.colSpan, 0);
    const className = [
      this.state.draggingColumn ? 'dragging' : '',
      hideHeader ? 'hidden-header' : ''
    ].join(' ');

    if(flatten(rows).length >= 1) {
      return (
        <thead
          className={className}
          ref={this.setRef}
        >
          {rows.map((row: FieldHeader[], r: number) => {
            return (
              <tr key={r}>
                {r === 0 && renderGridRowHeader(rowHeader, null, rows.length)}
                {row.map((fieldHeader: FieldHeader, idx: number, headers: FieldHeader[]) => (
                  this.renderHeaderRow(rows.length, colCount, r, fieldHeader, idx, headers))
                )}
              </tr>
            );
          })}
          {this.renderPinnedRows()}
        </thead>
      );
    } else {
      return (
        <thead className={className}>
          <tr>
            <th>
              <span style={{float: 'right'}}>
                {this.renderColumnChooserButton()}
              </span>
            </th>
          </tr>
          {this.renderPinnedRows()}
        </thead>
      );
    }
  }
}
