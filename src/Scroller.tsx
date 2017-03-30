import * as React from 'react';

export default class Scroller extends React.Component<{
  top: number;
  height: number;
  viewPortHeight: number;
  visible: boolean;
  onScroll: (scrollTop: number) => void;
  scrollTop: number;
}, {}> {

  public static propTypes = {
    /**
     * The top offset of the Scroller, used to place the scroller below the table header
     */
    top: React.PropTypes.number,
    /**
     * The height of the Scroller, typically the rowHeight * maxVisibleRows
     */
    height: React.PropTypes.number,
    /**
     * The viewPortHeight is the number of total rows * the row height
     */
    viewPortHeight: React.PropTypes.number,
    /**
     * Show or hide the scrollbar
     */
    visible: React.PropTypes.bool,
    /**
     * callback for onScroll called with the scroll thumb changes
     */
    onScroll: React.PropTypes.func,
    /**
     * The scrollTop value of the scroller div
     */
    scrollTop: React.PropTypes.number
  };

  public static defaultProps = {
    scrollTop: 0
  };

  private scrollTop = null;
  private scrollerRef: any;

  constructor(props) {
    super(props);
  }

  private onScroll() {
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(this.scrollerRef.scrollTop);
    }
  }

  private setScrollTop(scrollTop) {
    if(this.scrollTop === scrollTop) {
      return;
    }
    this.scrollTop = scrollTop;
    if (this.scrollerRef) {
      this.scrollerRef.scrollTop = scrollTop;
    }
  }

  public shouldComponentUpdate(nextProps) {
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

  public render() {
    const { top, height, visible, viewPortHeight } = this.props;
    const style = {
      position: 'absolute',
      right: '0px',
      top: `${top}px`,
      height: `${height}px`,
      overflowY: 'scroll',
      overflowX: 'hidden',
      width: '15px',
      display: visible ? 'block' : 'none'
    };
    const refFn = ref => this.scrollerRef = ref;
    return (
      <div
        className='virtual-table-scroller'
        onScroll={this.onScroll.bind(this)}
        ref={refFn}
        style={style}
      >
        <div style={{width: '1px', height: `${viewPortHeight}px`}}/>
      </div>
    );
  }
}
