import * as React from 'react';
import Scroller from './Scroller';

const propTypes = {
  /**
    * The total number of rows in the data set, used to calculate the scrollbar thumb size & scroll range
    */
  rowCount: React.PropTypes.number.isRequired,
  /**
    * A callback function to get the data for the row at the specified index (index: number) => { data: any }
    */
  getRow: React.PropTypes.func.isRequired,
  /**
   *  The height of the table. If a number it is provided it assumed to be px, strings can be any valid height css value
   */
  height: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  /**
   *  The width of the table. If a number it is provided it assumed to be px, strings can be any valid height css value
   */
  width: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  /**
   *  The topRow index, use if parent component controlls topRow
   */
  topRow: React.PropTypes.number,
  /**
   *  The topRowChanged callback, use if parent component controlls topRow
   */
  onTopRowChanged: React.PropTypes.func,
  /**
   *  The number of rows to move when the scrollWheel is used
   */
  scrollWheelRows: React.PropTypes.number,
  /**
   *  The static height of each row
   */
  rowHeight: React.PropTypes.number,
  /**
   *  The static height of the hader row
   */
  headerHeight: React.PropTypes.number,
  /**
   *  Class names to the container div
   */
  containerClassName: React.PropTypes.string,
  /**
   *  Style attributes to apply to the container div
   */
  containerStyle: React.PropTypes.any,
  /**
   *  Class names to apply to the table element
   */
  className: React.PropTypes.string,
  /**
   *  Style attributes to apply to the table element
   */
  style: React.PropTypes.any,
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
    throw Error('header, if supplied, must be a Stateless Functional Component or extend React.Component');
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
    throw Error('row must be a Stateless Functional Component or extend React.Component');
  }
};

const defaultProps = {
  height: '100%',
  width: '100%',
  scrollWheelRows: 5
};

export type RowProps = {
  data: any;
  index: number;
  [k: string]: any;
};

export type VirtualTableBaseProps = {
  rowCount: number;
  height?: number|string;
  width?: number|string;
  topRow?: number;
  onTopRowChanged?: (topRow: number) => void;
  scrollWheelRows?: number;
  rowHeight?: number;
  headerHeight?: number;
  containerClassName?: string;
  containerStyle?: any;
  className?: string;
  style?: any;
};

export type VirtualTableProps = VirtualTableBaseProps & {
  header: React.ComponentClass<any>|React.StatelessComponent<any>|React.ReactElement<any>;
  row: React.ComponentClass<RowProps>|React.StatelessComponent<RowProps>|React.ReactElement<RowProps>;
  getRow: (rowIndex: number) => {data: any, [k: string]: any};
};

export default class VirtualTable extends React.PureComponent<VirtualTableProps, {
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

  private containerRef: any;
  private headerRef: any;

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
  private calculateHeightStateValues(height, headerHeight, rowHeight) {
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
  private getTopRow() {
    if(this.state.topRowControlled) {
      return this.props.topRow;
    }
    return this.state.topRow;
  }

  /**
   * Set the topRow via internal state or owner controlled onTopRowChanged prop
   * @private
   */
  private setTopRow(topRow) {
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
   * Get the row data for the visibleRowIndex based on topRow
   * @private
   */
  private getRowProps(topRow, visibleRowIndex) {
    const { getRow } = this.props;
    const index = topRow + visibleRowIndex;
    return Object.assign({}, {index}, getRow(index));
  }

  /**
   * onScroll handler for Scroller or Wheel
   * @private
   */
  private onScroll(scrollTop) {
    const topRow = Math.round(scrollTop / this.state.rowHeight);
    this.setTopRow(topRow);
  }

  /**
   * onWhell handler sets scrollRef.scrollTop, which calls onScroll
   * @private
   */
  private onWheel(e) {
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
    return Math.min(this.props.rowCount, this.state.maxVisibleRows);
  }

  /**
   * If the calculator is rendered on mount, calculate heights
   */
  public componentDidMount() {
    if (this.state.calculatingHeights) {
      setTimeout(() => this.calculateHeights(), 250);
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
  public componentWillReceiveProps(nextProps) {
    if(!this.props.rowCount && nextProps.rowCount) {
      this.setState({calculatingHeights: true});
    }
  }

  /**
   * Recalculate header and row heights based on container size
   * Call this method when the window or container size changed
   */
  public calculateHeights() {
    const div = this.containerRef;
    const height = div.clientHeight;
    const header = div.querySelector('table > thead');
    const headerHeight = header ? header.scrollHeight : 0;
    const scrollHeights = Array.prototype.slice.call(div.querySelectorAll('table > tbody > tr')).map(e => e.scrollHeight);
    const rowHeight = Math.max.apply(Math, scrollHeights);
    this.setState(Object.assign({}, this.state, this.calculateHeightStateValues(height, headerHeight, rowHeight)));
  }

  /**
   * Build the <thead> element from header Component/Stateless Component or existing element
   * @private
   */
  private buildHeader() {
    const { header } = this.props;
    if (!header) {
      this.headerRef = null;
      return null;
    }
    if (React.isValidElement(header)) {
      this.headerRef = header;
      return header;
    }
    return React.createElement(header as any, { ref: ref => this.headerRef = ref });
  }

  /**
   * Build the <tr> elements for rows by cloning the rowElement
   * @private
   */
  private buildRows() {
    const { row } = this.props;
    const topRow = this.getTopRow();
    let rowCount = this.visibleRows();
    if(rowCount === 0) {
      return [];
    }

    const rowElement = React.isValidElement(row) ? row : React.createElement(row as any);
    const rows = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      let props = Object.assign({}, this.getRowProps(topRow, i), { key: i});
      rows[i] = React.cloneElement(rowElement as any, props);
    }
    return rows;
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
      overflowX: 'auto',
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
      <div onWheel={this.onWheel.bind(this)}
           ref={(ref) => this.containerRef = ref}
           className={containerClassName}
           style={containerStyle}>
        <div style={{overflowX: 'auto', overflowY: 'hidden'}}>
          <table className={tableClassName} style={tableStyle}>
            {header}
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <Scroller
           onScroll={this.onScroll.bind(this)}
           scrollTop={topRow * rowHeight}
           top={(headerHeight || 0)}
           height={this.visibleRows() * rowHeight}
           visible={rowCount > this.state.maxVisibleRows}
           viewPortHeight={rowHeight * rowCount} />
      </div>
    );
  }

  /**
   * Render the table calculator to determine heights
   * @private
   */
  private renderCalculator(header, rows, containerClassName, containerStyle, tableClassName, tableStyle) {
    return (
      <div className={`${containerClassName} calculator`}
           ref={(ref) => this.containerRef = ref }
           style={Object.assign({}, containerStyle, {visibility: 'hidden'})}>
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
