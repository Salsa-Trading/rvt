import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

export type ScrollerProps = {
  top: number;
  height: number;
  viewPortHeight: number;
  visible: boolean;
  onScroll: (scrollTop: number) => void;
  scrollTop: number;
};

export default class Scroller extends React.Component<ScrollerProps, {}> {

  public static propTypes = {
    /**
     * The top offset of the Scroller, used to place the scroller below the table header
     */
    top: PropTypes.number,
    /**
     * The height of the Scroller, typically the rowHeight * maxVisibleRows
     */
    height: PropTypes.number,
    /**
     * The viewPortHeight is the number of total rows * the row height
     */
    viewPortHeight: PropTypes.number,
    /**
     * Show or hide the scrollbar
     */
    visible: PropTypes.bool,
    /**
     * callback for onScroll called with the scroll thumb changes
     */
    onScroll: PropTypes.func,
    /**
     * The scrollTop value of the scroller div
     */
    scrollTop: PropTypes.number
  };

  public static defaultProps = {
    scrollTop: 0
  };

  private scrollTop = null;
  private scrollerRef: any;

  constructor(props) {
    super(props);
  }

  @autobind
  private onScroll() {
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(this.scrollerRef.scrollTop);
    }
  }

  private setScrollTop(scrollTop: number) {
    if(this.scrollTop === scrollTop) {
      return;
    }
    this.scrollTop = scrollTop;
    if (this.scrollerRef) {
      this.scrollerRef.scrollTop = scrollTop;
    }
  }

  public shouldComponentUpdate(nextProps: ScrollerProps) {
    const { top, height, visible, viewPortHeight, scrollTop } = this.props;
    if(nextProps.top !== top ||
       nextProps.height !== height ||
       nextProps.visible !== visible ||
       nextProps.viewPortHeight !== viewPortHeight) {
      return true;
    }

    if(nextProps.scrollTop !== scrollTop) {
      this.setScrollTop(nextProps.scrollTop);
    }
    return false;
  }

  public componentDidMount() {
    this.setScrollTop(this.props.scrollTop);
  }

  public componentDidUpdate() {
    this.setScrollTop(this.props.scrollTop);
  }

  @autobind
  private setScrollerRef(ref: HTMLDivElement) {
    this.scrollerRef = ref;
  }

  public render() {
    const { top, height, visible, viewPortHeight } = this.props;
    const style: React.CSSProperties = {
      position: 'absolute',
      right: '0px',
      top: `${top}px`,
      height: `${height}px`,
      overflowY: 'scroll' as any,
      overflowX: 'hidden' as any,
      width: '15px',
      display: visible ? 'block' : 'none'
    };
    return (
      <div
        className='virtual-table-scroller'
        onScroll={this.onScroll}
        ref={this.setScrollerRef}
        style={style}
      >
        <div style={{width: '1px', height: `${viewPortHeight}px`}}/>
      </div>
    );
  }
}
