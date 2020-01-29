import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Scroller from './Scroller';
import { difference, omit, zipObject, map, debounce, mean, sum } from 'lodash';

type TableStyles = {
  container: React.CSSProperties;
  table: React.CSSProperties;
  tbody: React.CSSProperties;
};

const propTypes: {[K in keyof VirtualTableProps<any>]: any} = {
  /**
    * The total number of rows in the data set, used to calculate the scrollbar thumb size & scroll range
    */
  rowCount: PropTypes.number.isRequired,
  /**
    * A callback function to get the data for the row at the specified index (index: number) => { data: any }
    */
  getRow: (props) => {
    const {getRow} = props;
    if(!getRow) {
      return;
    }
    if(!(typeof getRow === 'function')) {
      throw new Error('getRow must be a function');
    }
  },
  /**
   *  The height of the table. If a number it is provided it assumed to be px, strings can be any valid height css value
   */
  getRows: (props) => {
    const {getRow, getRows} = props;
    if(!getRows) {
      return;
    }
    if(!(typeof getRows === 'function')) {
      throw new Error('getRows must be a function');
    }
    if(getRow && getRows) {
      throw new Error('getRow and getRows can not both be defined');
    }
  },
  /**
   *  The height of the table. If a number it is provided it assumed to be px, strings can be any valid height css value
   */
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  /**
   *  The width of the table. If a number it is provided it assumed to be px, strings can be any valid height css value
   */
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  /**
   *  The topRow index, use if parent component controlls topRow
   */
  topRow: PropTypes.number,
  /**
   *  The topRowChanged callback, use if parent component controlls topRow
   */
  onTopRowChanged: PropTypes.func,
  /**
   *  The number of rows to move when the scrollWheel is used
   */
  scrollWheelRows: PropTypes.number,
  /**
   *  The static height of each row
   */
  rowHeight: PropTypes.number,
  /**
   *  The static height of the hader row
   */
  headerHeight: PropTypes.number,
  /**
   *  Class names to the container div
   */
  containerClassName: PropTypes.string,
  /**
   *  Style attributes to apply to the container div
   */
  containerStyle: PropTypes.any,
  /**
   *  Class names to apply to the table element
   */
  className: PropTypes.string,
  /**
   *  Style attributes to apply to the table element
   */
  tableStyle: PropTypes.object,
  /**
   *  Style attributes to apply to the tbody element
   */
  tbodyStyle: PropTypes.object,
  /**
   *  The React Component or React Stateless function to render the header (must render a <thead> root element
   */
  header: (props) => {
    const header = props.header;
    if (!header) {
      return;
    }
    if (typeof header === 'function') {
      return;
    }
    if (React.isValidElement(header)) {
      return;
    }
    throw new Error('header, if supplied, must be a Stateless Functional Component or extend React.Component');
  },
  /**
   *  The React Component or React Stateless function to render rows (must render a <tr> root element
   */
  row: (props) => {
    const row = props.row;
    if (typeof row === 'function') {
      return;
    }
    if (React.isValidElement(row)) {
      return;
    }
    throw new Error('row must be a Stateless Functional Component or extend React.Component');
  },
  /**
   * Window events that should trigger a recalculation of visibleTableRows if autoResize is true
   */
  windowResizeEvents: PropTypes.arrayOf(PropTypes.string)
};

const defaultProps = {
  scrollWheelRows: 5,
  windowResizeEvents: ['resize']
};

export type Indexed<T> = T & {index: number};

export type TableRowProps<TData> = {
  data: TData;
  key?: string;
};

export type VirtualTableBaseProps = {
  rowCount: number;
  height?: number|string;
  autoResize?: boolean;
  width?: number|string;
  topRow?: number;
  onTopRowChanged?: (topRow: number) => void;
  scrollWheelRows?: number;
  rowHeight?: number;
  headerHeight?: number;
  containerClassName?: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  tbodyStyle?: React.CSSProperties;
  windowResizeEvents?: string[];
  fixedColumnWidth?: boolean;
};

export type VirtualTableProps<TData extends object> = VirtualTableBaseProps & {
  header: React.ComponentType<any>|React.ReactElement<any>;
  row: React.ComponentType<TableRowProps<TData>> | React.ReactElement<TableRowProps<TData>>;
  getRow?: (rowIndex: number) => TableRowProps<TData>;
  getRows?: (topRowIndex: number, count: number, maxVisibleRows: number) => TableRowProps<TData>[];
};

export type VirtualTableState = {
  topRowControlled: boolean;
  topRow: number;
  headerHeight: number;
  rowHeight: number;
  maxVisibleRows: number;
  calculatingHeights: boolean;
};

@autobind
export default class VirtualTable<TData extends object> extends React.PureComponent<VirtualTableProps<TData>, VirtualTableState> {

  public static propTypes = propTypes;
  public static defaultProps = defaultProps;

  private containerRef: HTMLDivElement;
  private innerRef: HTMLDivElement;
  private dataKeyToRowKeyMap: {[dataKey: string]: number} = {};
  private rowKeyCounter = 1;
  private debouncedOnWindowResize: () => void;

  constructor(props, context) {
    super(props, context);
    const topRowControlled = props.topRow !== undefined;
    this.updateMaxVisibleRows = debounce(this.updateMaxVisibleRows.bind(this), 250);
    this.state = {
      topRow: topRowControlled ? undefined : 0,
      topRowControlled,
      ...this.calculateHeightStateValues(this.props.height, this.props.headerHeight, this.props.rowHeight)
    };
  }

  private get tableHeight(): number {
    const {innerRef, containerRef} = this;
    if(innerRef) {
      return innerRef.clientHeight;
    } else if(containerRef) {
      return containerRef.clientHeight;
    }
  }

  private get headerHeight(): number {
    const div = this.containerRef;
    if(!div) {
      return;
    }
    const header = div.querySelector('table > thead');
    return header ? header.scrollHeight : 0;
  }

  private updateMaxVisibleRows() {
    const prevMaxVisibleRows = this.state.maxVisibleRows;
    if (this.props.rowCount < prevMaxVisibleRows) {
      return;
    }

    const height = this.tableHeight;
    const headerHeight = this.headerHeight;
    const currentlyVisibleRowHeights = this.currentlyVisibleRowHeights.slice(0, prevMaxVisibleRows);
    const avgRowHeight = mean(currentlyVisibleRowHeights);
    const unusedHeight = height - headerHeight - sum(currentlyVisibleRowHeights);
    const absUnused = Math.abs(unusedHeight);
    const direction = unusedHeight / absUnused;
    const maxVisibleRows = prevMaxVisibleRows + direction * Math.floor(absUnused / avgRowHeight);
    if (maxVisibleRows !== prevMaxVisibleRows && maxVisibleRows >= 1) {
      this.setState({ maxVisibleRows });
    }
  }

  /**
   * Caclulate the maxVisibleRows from height values for the container, header and rows
   * @private
   */
  private calculateHeightStateValues(height: number|string, headerHeight: number, rowHeight: number) {
    let maxVisibleRows = null;
    if (typeof height === 'number') {
      if (height && rowHeight && headerHeight) {
        // Calculate expected number of visible rows based on average row height
        maxVisibleRows = Math.floor((height - headerHeight) / rowHeight);
      }
    }

    const heightState = {
      maxVisibleRows: maxVisibleRows || 10,
      calculatingHeights: maxVisibleRows === null,
      rowHeight,
      headerHeight: headerHeight || rowHeight
    };
    return heightState;
  }

  /**
   * Get the topRow via internal state or owner controlled topRow prop
   * @private
   */
  private getTopRow(): number {
    if(this.state.topRowControlled) {
      return this.props.topRow;
    }
    return this.state.topRow;
  }

  /**
   * Set the topRow via internal state or owner controlled onTopRowChanged prop
   * @private
   */
  private setTopRow(topRow: number) {
    topRow = Math.max(0, Math.min(topRow, this.props.rowCount - this.visibleRows()));
    if(this.state.topRowControlled) {
      const { onTopRowChanged } = this.props;
      if(onTopRowChanged) {
        onTopRowChanged(topRow);
      }
    }
    else {
      this.setState({topRow});
    }
  }

  /**
   * onScroll handler for Scroller or Wheel
   * @private
   */
  private onScroll(scrollTop: number) {
    const topRow = Math.ceil(scrollTop / this.state.rowHeight);
    this.setTopRow(topRow);
  }

  /**
   * onWhell handler sets scrollRef.scrollTop, which calls onScroll
   * @private
   */
  private onWheel(e: React.WheelEvent<{}>) {
    const { scrollWheelRows } = this.props;
    e.stopPropagation();
    this.setTopRow(this.getTopRow() + ((e.deltaY > 0 ? 1 : -1) * scrollWheelRows));
  }

  /**
   * Returns the visibleRow (minimum of rowCount and maxVisibleRows)
   * @private
   */
  private visibleRows() {
    return Math.max(Math.min(this.props.rowCount, this.state.maxVisibleRows), 0);
  }

  /**
   * If the calculator is rendered on mount, calculate heights
   * Listen for window resizes if 'autoResize' is enabled
   */
  public componentDidMount() {
    this.debouncedOnWindowResize = debounce(() => this.calculateHeights(), 100);
    this.debouncedOnWindowResize();

    if (this.state.calculatingHeights) {
      setTimeout(() => this.calculateHeights(), 250);
    }

    const {autoResize, windowResizeEvents} = this.props;
    if (autoResize) {
      (windowResizeEvents || []).forEach(event => window.addEventListener(event, this.debouncedOnWindowResize));
    }
  }

  /**
   * Remove window listeners if 'autoResize' is enabled
   */
  public componentWillUnmount() {
    const {autoResize, windowResizeEvents} = this.props;
    if (autoResize) {
      (windowResizeEvents || []).forEach(event => window.removeEventListener(event, this.debouncedOnWindowResize));
    }
  }

  /**
   * If the calculator is rendered on mount, calculate heights
   */
  public componentDidUpdate(prevProps: VirtualTableProps<TData>, prevState: VirtualTableState) {
    if (this.state.calculatingHeights) {
      this.calculateHeights();
    }

    const visibleRowsJustChanged = this.state.maxVisibleRows !== prevState.maxVisibleRows;
    if(!visibleRowsJustChanged) {
      this.updateMaxVisibleRows();
    }
  }

  /**
   * If the table was initialized as an empty table (no rows) re-run calculator
   */
  public UNSAFE_componentWillReceiveProps(nextProps: VirtualTableProps<TData>) {
    if(!this.props.rowCount && nextProps.rowCount) {
      this.setState({calculatingHeights: true});
    }
  }

  /**
   * Recalculate header and row heights based on container size
   * Call this method when the window or container size changed
   */
  private calculateHeights() {
    const div = this.containerRef;
    if(!div) {
      return;
    }
    const height = this.tableHeight;
    const headerHeight = this.headerHeight;
    const rowHeight = mean(this.currentlyVisibleRowHeights);

    this.setState({
      ...this.calculateHeightStateValues(height, headerHeight, rowHeight)
    }, this.scrollToTopIfAllRowsVisible);
  }

  private get currentlyVisibleRowHeights(): number[] {
    return this.renderedRows.map(e => e.getBoundingClientRect().height);
  }

  private get renderedRows() {
    const div = this.containerRef;
    if(!div) {
      return [];
    }
    return Array.from(div.querySelectorAll('table > tbody > tr'));
  }

  private scrollToTopIfAllRowsVisible() {
    if (this.visibleRows() >= this.props.rowCount && this.getTopRow() !== 0) {
      this.setTopRow(0);
    }
  }

  /**
   * Build the <thead> element from header Component/Stateless Component or existing element
   * @private
   */
  private buildHeader() {
    const { header } = this.props;
    if (!header) {
      return null;
    }
    if (React.isValidElement(header)) {
      return header;
    }
    return React.createElement(header as React.ComponentType<any>);
  }

  /**
   * Build rowProps from getRows or getRow
   * @private
   */
  private getRows(): TableRowProps<TData>[] {
    const { getRow, getRows, rowCount } = this.props;

    const topRow = this.getTopRow();
    const numRows = Math.min(
      this.visibleRows(),
      rowCount - topRow
    );

    if(numRows < 0) {
      return [];
    }

    let rowProps: TableRowProps<TData>[];
    if(getRows) {
      rowProps = getRows(topRow, numRows, this.state.maxVisibleRows);
    }
    else {
      rowProps = new Array(numRows);
      for (let i = 0; i < numRows; i++) {
        rowProps[i] = getRow(topRow + i);
      }
    }
    return rowProps;
  }

  /**
   * Build the <tr> elements for rows by cloning the rowElement
   * @private
   */
  private buildRows() {
    const { row } = this.props;
    const { dataKeyToRowKeyMap } = this;
    const rows = this.getRows();

    // Re-compute row keys for all visible elements
    const previousDataKeys: string[] = Object.keys(dataKeyToRowKeyMap);
    const newDataKeys: string[] = rows.map((row, i) => {
      return row.key;
    });

    if (newDataKeys.every(Boolean)) {
      const removedDataKeys: string[] = difference(previousDataKeys, newDataKeys);
      const removedRowKeys: number[] = removedDataKeys.map((dataKey) => dataKeyToRowKeyMap[dataKey]);

      const addedDataKeys: string[] = difference(newDataKeys, previousDataKeys);

      // Create new dataKeyToRowKeyMap object
      const previousRowKeyDictionaryEntries = omit(dataKeyToRowKeyMap, removedDataKeys);
      const newRowKeyDictionaryEntries = zipObject(addedDataKeys, [
        // re-use old keys where applicable so component doesn't have to re-mount
        ...removedRowKeys,

        // Generate new row keys if no row had been created
        ...map(Array(Math.max(
          0,
          addedDataKeys.length - removedRowKeys.length
        )), () => this.rowKeyCounter++)
      ]);
      this.dataKeyToRowKeyMap = {
        ...previousRowKeyDictionaryEntries,
        ...newRowKeyDictionaryEntries
      };
    }

    const rowElement = React.isValidElement(row)
      ? row as React.ReactElement<Indexed<TableRowProps<TData>>>
      : React.createElement(row as React.ComponentType<Indexed<TableRowProps<TData>>>);

    return rows.map((props, i) => React.cloneElement(rowElement, {
      ...props,
      key: (this.dataKeyToRowKeyMap[props.key] || i).toString()
    } as Indexed<TableRowProps<TData>>));
  }

  private setContainerRef(ref: HTMLDivElement) {
    this.containerRef = ref;
  }

  private setInnerRef(ref: HTMLDivElement) {
    this.innerRef = ref;
  }

  public render() {
    const { height, width, containerStyle = {}, tableStyle = {}, tbodyStyle = {} } = this.props;
    const { calculatingHeights } = this.state;
    const header = this.buildHeader();
    const rows = this.buildRows();
    const tableClassName = this.props.className;

    const styles: TableStyles = {
      container: {
        position: 'relative',
        height,
        width,
        ...containerStyle
      },
      table: {
        ...tableStyle
      },
      tbody: tbodyStyle
    };

    if (calculatingHeights) {
      return this.renderCalculator(header, rows, tableClassName, styles);
    }

    return this.renderTable(header, rows, tableClassName, styles);
  }

  private onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const {rowCount} = this.props;
    const {maxVisibleRows} = this.state;
    const topRow = this.getTopRow();
    const pageSize = maxVisibleRows / 2;

    switch(event.key) {
      case 'ArrowUp':
        this.setTopRow(topRow - 1);
        return;
      case 'ArrowDown':
        this.setTopRow(topRow + 1);
        return;
      case 'PageUp':
        this.setTopRow(topRow - pageSize);
        return;
      case ' ':
        if(event.shiftKey) {
          this.setTopRow(topRow - pageSize);
        } else {
          this.setTopRow(topRow + pageSize);
        }
        return;
      case 'PageDown':
        this.setTopRow(topRow + pageSize);
        return;
      case 'Home':
        this.setTopRow(0);
        return;
      case 'End':
        this.setTopRow(rowCount - 1);
        return;
    }
  }

  /**
   * Render the table
   * @private
   */
  private renderTable(header, rows, tableClassName: string, styles: TableStyles) {
    const { rowCount, fixedColumnWidth } = this.props;
    const { headerHeight, rowHeight } = this.state;
    const tableStyle: React.CSSProperties = styles.table || {};
    const containerStyle: React.CSSProperties = styles.container || {};
    const tbodyStyle: React.CSSProperties = styles.tbody || {};
    const topRow = this.getTopRow();
    const scrollerVisible = rowCount > this.state.maxVisibleRows;

    return (
      <div
        onWheel={this.onWheel}
        onKeyDown={this.onKeyDown}
        ref={this.setContainerRef}
        className={`${this.className} rvt-virtual-table ${fixedColumnWidth ? 'fixed-column-width' : '' }`}
        style={containerStyle}
        tabIndex={1}
      >
        <div className='rvt-virtual-table-container'>
          <div className='rvt-virtual-table-container-scroll'>
            <div className='rvt-virtual-table-container-inner' ref={this.setInnerRef} >
              <table className={tableClassName} style={tableStyle}>
                {header}
                <tbody className={scrollerVisible ? 'rvt-scroller' : ''} style={tbodyStyle}>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
          <Scroller
            onScroll={this.onScroll}
            scrollOffset={topRow * rowHeight}
            margin={(headerHeight || 0)}
            visible={scrollerVisible}
            virtualSize={rowHeight * rowCount}
          />
        </div>
      </div>
    );
  }

  /**
   * Render the table calculator to determine heights
   * @private
   */
  private renderCalculator(header, rows, tableClassName, styles: TableStyles) {
    return (
      <div
        className={`${this.className} calculator`}
        ref={this.setContainerRef}
        style={styles.container}
      >
        <div className='rvt-virtual-table-container'>
          <table className={tableClassName} style={styles.table}>
            {header}
            <tbody style={{...styles.tbody, visibility: 'hidden'}}>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private get className(): string {
    const {containerClassName} = this.props;
    return `rvt ${containerClassName ? containerClassName : ''}`;
  }
}
