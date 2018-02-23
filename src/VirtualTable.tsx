import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Scroller from './Scroller';
import { difference, omit, zipObject, map, debounce } from 'lodash';

const propTypes = {
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
  style: PropTypes.any,
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
  width: '100%',
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
  containerStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  windowResizeEvents?: string[];
};

export type VirtualTableProps<TData extends object> = VirtualTableBaseProps & {
  header: React.ComponentType<any>|React.ReactElement<any>;
  row: React.ComponentType<TableRowProps<TData>> | React.ReactElement<TableRowProps<TData>>;
  getRow?: (rowIndex: number) => TableRowProps<TData>;
  getRows?: (topRowIndex: number, count: number) => TableRowProps<TData>[];
};

export default class VirtualTable<TData extends object> extends React.PureComponent<VirtualTableProps<TData>, {
  topRowControlled: boolean;
  topRow: number;
  headerHeight: number;
  rowHeight: number;
  height: number;
  maxVisibleRows: number;
  calculatingHeights: boolean;
}> {

  public static propTypes = propTypes;
  public static defaultProps = defaultProps;

  private containerRef: HTMLDivElement;
  private dataKeyToRowKeyMap: {[dataKey: string]: number} = {};
  private rowKeyCounter = 1;
  private debouncedOnWindowResize: () => void;

  constructor(props, context) {
    super(props, context);
    const topRowControlled = props.topRow !== undefined;
    this.state = Object.assign({
      topRow: topRowControlled ? undefined : 0,
      topRowControlled
    },
      this.calculateHeightStateValues(this.props.height, this.props.headerHeight, this.props.rowHeight)
    );
  }

  /**
   * Caclulate the maxVisibleRows from height values for the container, header and rows
   * @private
   */
  private calculateHeightStateValues(height: number|string, headerHeight: number, rowHeight: number) {
    let maxVisibleRows = null;
    if (typeof height === 'number') {
      if (height && rowHeight && headerHeight) {
        maxVisibleRows = Math.floor((height - headerHeight) / rowHeight);
      }
    }
    const heightState = {
      maxVisibleRows: maxVisibleRows || 10,
      calculatingHeights: maxVisibleRows === null,
      rowHeight,
      headerHeight: headerHeight || rowHeight,
      height: typeof height === 'number' ? height : null
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
  @autobind
  private onScroll(scrollTop: number) {
    const topRow = Math.round(scrollTop / this.state.rowHeight);
    this.setTopRow(topRow);
  }

  /**
   * onWhell handler sets scrollRef.scrollTop, which calls onScroll
   * @private
   */
  @autobind
  private onWheel(e: React.WheelEvent<{}>) {
    const { scrollWheelRows } = this.props;
    e.stopPropagation();
    e.preventDefault();
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
  public componentDidUpdate() {
    if (this.state.calculatingHeights) {
      this.calculateHeights();
    }
  }

  /**
   * If the table was initialized as an empty table (no rows) re-run calculator
   */
  public componentWillReceiveProps(nextProps: VirtualTableProps<TData>) {
    if(!this.props.rowCount && nextProps.rowCount) {
      this.setState({calculatingHeights: true});
    }
  }

  /**
   * Recalculate header and row heights based on container size
   * Call this method when the window or container size changed
   */
  @autobind
  private calculateHeights() {
    const div = this.containerRef;
    const height = this.props.height ? div.clientHeight : (div.parentElement.clientHeight) - 6;
    const header = div.querySelector('table > thead');
    const headerHeight = header ? header.scrollHeight : 0;
    const scrollHeights = Array.prototype.slice.call(div.querySelectorAll('table > tbody > tr')).map(e => e.scrollHeight);
    const rowHeight = Math.max.apply(Math, scrollHeights);

    this.setState({
      ...this.state,
      ...this.calculateHeightStateValues(height, headerHeight, rowHeight)
    }, this.scrollToTopIfAllRowsVisible);
  }

  @autobind
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
  private getRows(): Indexed<TableRowProps<TData>>[] {
    const { getRow, getRows, rowCount } = this.props;

    const topRow = this.getTopRow();
    const numRows = Math.min(
      this.visibleRows(),
      rowCount - topRow
    );

    if(!numRows) {
      return [];
    }

    let rowProps: Indexed<TableRowProps<TData>>[];
    if(getRows) {
      rowProps = getRows(topRow, numRows).map((rowProps: TableRowProps<TData>, i: number) => {
        return {
          ...rowProps,
          index: topRow + i
        };
      });

    }
    else {
      rowProps = new Array(numRows);
      for (let i = 0; i < numRows; i++) {
        rowProps[i] = {
          ...getRow(topRow + i),
          index: topRow + i
        };
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
      ? row as React.ReactElement<Indexed<TableRowProps<TData>> & {key: number}>
      : React.createElement(row as React.ComponentType<Indexed<TableRowProps<TData> & {key: number}>>);

    return rows.map((props, i) => React.cloneElement(rowElement, {
      ...props,
      key: this.dataKeyToRowKeyMap[props.key] || i,
    }));
  }

  @autobind
  private setContainerRef(ref: HTMLDivElement) {
    this.containerRef = ref;
  }

  public render() {
    const { height, width } = this.props;
    const { calculatingHeights } = this.state;
    const header = this.buildHeader();
    const rows = this.buildRows();
    const tableClassName = this.props.className;
    const containerClassName = this.props.containerClassName;
    const tableStyle = Object.assign({ width: '100%' }, this.props.style);
    const containerStyle = Object.assign({
      position: 'relative',
      display: 'inline-block',
      height,
      width
    }, this.props.containerStyle);
    if (calculatingHeights) {
      return this.renderCalculator(header, rows, containerClassName, containerStyle, tableClassName, tableStyle);
    }
    return this.renderTable(header, rows, containerClassName, containerStyle, tableClassName, tableStyle);
  }

  /**
   * Render the table
   * @private
   */
  private renderTable(header, rows, containerClassName, containerStyle, tableClassName, tableStyle) {
    const { rowCount } = this.props;
    const { headerHeight, rowHeight } = this.state;
    const topRow = this.getTopRow();

    return (
      <div
        onWheel={this.onWheel}
        ref={this.setContainerRef}
        className={`rvt ${containerClassName ? containerClassName : ''}`}
        style={containerStyle}
      >
        <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
          <table className={tableClassName} style={tableStyle}>
            {header}
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <Scroller
          onScroll={this.onScroll}
          scrollOffset={topRow * rowHeight}
          margin={(headerHeight || 0)}
          size={this.visibleRows() * rowHeight}
          visible={rowCount > this.state.maxVisibleRows}
          virtualSize={rowHeight * rowCount}
        />
      </div>
    );
  }

  /**
   * Render the table calculator to determine heights
   * @private
   */
  private renderCalculator(header, rows, containerClassName, containerStyle, tableClassName, tableStyle) {
    return (
      <div
        className={`${containerClassName} calculator`}
        ref={this.setContainerRef}
        style={Object.assign({}, containerStyle, {visibility: 'hidden'})}
      >
        <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
          <table className={tableClassName} style={tableStyle}>
            {header}
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
