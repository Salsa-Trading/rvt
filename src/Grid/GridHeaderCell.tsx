import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import HeaderInput from './HeaderInput';
import Filter from '../Filter';
import { Field, SortDirection } from '../List/Field';
import { FieldSet } from '../List/FieldSet';
import safeMouseMove from '../utils/saveMouseMove';
import {throttle} from 'lodash';

export type GridHeaderCellProps = {
  field: Field;
  fieldSet: FieldSet;
  rowSpan?: number;
  colSpan?: number;
  canResize?: boolean;
  columnChooserButton?: any;
  hideFilters?: boolean;
  onSortSelection?: (sortDirection: SortDirection, field: Field) => void;
  onFilterChanged?: (filter: any, field: Field) => void;
  onWidthChanged?: (width: number, field: Field) => void;
  onTitleChanged?: (name: string, field: Field) => void;
  onMouseDown(e: React.MouseEvent<HTMLTableHeaderCellElement>);
};

export default class GridHeaderCell extends React.Component<GridHeaderCellProps, {
  showFilterOnClick?: boolean;
}> {

  public static defaultProps = {
    canResize: true
  };

  public static propTypes = {
    field: PropTypes.any,
    fieldSet: PropTypes.any,
    rowSpan: PropTypes.number,
    onSortSelection: PropTypes.func,
    onWidthChanged: PropTypes.func,
    onFilterChanged: PropTypes.func
  };

  private thRef: HTMLDivElement;

  constructor(props) {
    super(props);

    this.state = {
      showFilterOnClick: false
    };
    this.setFilterOpen = throttle(this.setFilterOpen, 700);
  }

  @autobind
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
    if(typeof this.props.field.width === 'number') {
      startingWidth = this.props.field.width;
    }
    else {
      startingWidth = e.currentTarget.closest('th').clientWidth;
    }

    let startingX = e.pageX;
    safeMouseMove<HTMLDivElement>(e,
      moveEvent => {
        onWidthChanged(startingWidth + (moveEvent.pageX - startingX), this.props.field);
        this.forceUpdate();
      }
    );
  }

  private onSortClick(sortDirection: SortDirection, e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { onSortSelection, field } = this.props;
    if(onSortSelection) {
      onSortSelection(sortDirection, field);
    }
  }

  private sortBtn(sortDirection: SortDirection): React.ReactElement<any> {
    const { field } = this.props;
    const classNames = [
      'sort',
      `sort-${sortDirection}`,
      field.sortDirection === sortDirection ? 'sort-active' : 'sort-inactive'
    ].join(' ');

    return (
      <button
        onClick={this.onSortClick.bind(this, sortDirection)}
        className={classNames}
      />
    );
  }

  @autobind
  private updateTitle(field: Field, updatedName: string) {
    this.props.onTitleChanged(updatedName, field);
    this.forceUpdate();
  }

  private renderHeader() {
    const {
      field,
      field: {
        header,
        name,
        title
      }
    } = this.props;
    const updateTitle = (updatedName) => this.updateTitle(field, updatedName);
    let headerComponent;

    if(title) {
      headerComponent = <HeaderInput title={title} updateTitle={updateTitle}/>;
    } else if(header && typeof header === 'string') {
      headerComponent = <HeaderInput title={header} updateTitle={updateTitle}/>;
    } else if (header && React.isValidElement(header)) {
      headerComponent = header;
    } else {
      headerComponent = <HeaderInput title={name} updateTitle={updateTitle}/>;
    }
    return headerComponent;
  }

  @autobind
  private updateHeaderWidth() {
    const {thRef} = this;
    if(thRef) {
      const width = this.thRef.clientWidth;
      if(width) {
        this.props.onWidthChanged(this.thRef.clientWidth, this.props.field);
      }
    }
  }

  public componentDidMount() {
    if(!this.props.field.width) {
      if (document.readyState === 'complete') {
        this.updateHeaderWidth();
      } else {
        window.addEventListener('load', () => {
          this.updateHeaderWidth();
        });
      }
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('load', this.updateHeaderWidth);
  }

  @autobind
  private setRef(ref) {
    this.thRef = ref;
  }

  @autobind
  public setFilterOpen(open) {
    this.setState({showFilterOnClick: open});
  }

  @autobind
  public onFilterClosed() {
    if (this.state.showFilterOnClick) {
      this.setFilterOpen(false);
    }
  }

  @autobind
  private onClick(e) {
    e.preventDefault();
    if (this.props.hideFilters) {
      this.setFilterOpen(true);
    }
  }

  @autobind
  private onMouseDown(e) {
    if(!this.state.showFilterOnClick) {
       this.props.onMouseDown(e);
    }
  }

  public render() {
    const {
      fieldSet,
      field,
      field: {
        name,
        width,
        sortDirection,
        sortable,
        filterable,
        filter
      },
      columnChooserButton,
      canResize,
      hideFilters,
      rowSpan,
      colSpan,
      onSortSelection,
      onFilterChanged,
      fixedColumnWidth
    } = this.props as any;
    const {showFilterOnClick} = this.state;

    const sortSelectionHandler = d => onSortSelection ? onSortSelection(d, field) : null;
    const filterChangedHandler = f => onFilterChanged ? onFilterChanged(f, field) : null;

    const headerClassName = [
      'grid-header-cell',
      sortable ? 'sortable' : null,
      sortable && sortDirection ? `sorted sorted-${name.sortDirection}` : null,
      filterable ? 'filterable' : null,
      filterable && filter ? 'filtered' : null
    ].join(' ');

    let sortFilterControl;
    if(filterable && (showFilterOnClick || (hideFilters && filter) || !hideFilters)) {
      sortFilterControl = (
        <Filter
          openOnMounted={showFilterOnClick}
          field={field}
          onSortSelection={sortSelectionHandler}
          onFilterChanged={filterChangedHandler}
          onFilterClosed={this.onFilterClosed}
        />
      );
    }
    else if (sortable && ((hideFilters && sortDirection) || !hideFilters)) {
      sortFilterControl = (
        <div>
          {this.sortBtn(SortDirection.asc)}
          {this.sortBtn(SortDirection.desc)}
        </div>
      );
    }
    const dataSet = {'data-group': fieldSet.name, 'data-field': name};

    const style: React.CSSProperties = {
      padding: 0,
      width: isFinite(width) ? width : undefined,
      maxWidth: (fixedColumnWidth && isFinite(width)) ? width : undefined
    };

    return (
      <th
        key={name}
        className='grid-header'
        style={style}
        rowSpan={rowSpan}
        colSpan={colSpan}
        {...dataSet}
        ref={this.setRef}
        onContextMenu={this.onClick}
      >
        <div className={`${headerClassName}`}>
          <div
            className='header'
            onMouseDown={this.onMouseDown}
          >
            <div className='header-text'>
              {this.renderHeader()}
            </div>
          </div>
          <div className='sort-filter'>
            {sortFilterControl}
          </div>
          {canResize && <div className='resize-handle' onMouseDown={this.onResizeHandleMouseDown} />}
          {columnChooserButton && <div className='column-chooser'>{columnChooserButton}</div>}
        </div>
      </th>
    );
  }
}
