import * as React from 'react';
import * as PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { throttle } from 'lodash';

export type ScrollerProps = {
  margin?: number;
  size?: number;
  virtualSize: number;
  visible?: boolean;
  onScroll: (scrollTop: number) => void;
  scrollOffset: number;
  orientation?: 'vertical'|'horizontal';
};

export default class Scroller extends React.Component<ScrollerProps, {}> {

  public static propTypes = {
    /**
     * The top/left offset of the Scroller, used to place the scroller below the table header
     */
    margin: PropTypes.number,
    /**
     * The length of the Scroller, typically the rowHeight * maxVisibleRows
     */
    size: PropTypes.number,
    /**
     * The viewPortHeight is the number of total rows * the row length
     */
    viewPortSize: PropTypes.number,
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
    scrollOffset: PropTypes.number,
    /**
     * The orientation of the scroll bar
     */
    orientation: PropTypes.oneOf(['vertical', 'horizontal'])
  };

  public static defaultProps = {
    scrollOffset: 0,
    margin: 0,
    visible: true,
    orientation: 'vertical'
  };

  private scrollOffset: number = null;
  private scrollerRef: HTMLDivElement;
  private throttledOnScroll: () => void;

  private onScroll() {
    const { onScroll } = this.props;
    if (onScroll) {
      if(this.props.orientation === 'vertical') {
        onScroll(this.scrollerRef.scrollTop);
      }
      else {
        onScroll(this.scrollerRef.scrollLeft);
      }
    }
  }

  public componentWillMount() {
    this.throttledOnScroll = throttle(this.onScroll.bind(this), 100);
  }

  private setScrollOffset(scrollOffset: number) {
    if(this.scrollOffset === scrollOffset) {
      return;
    }
    this.scrollOffset = scrollOffset;
    if (this.scrollerRef) {
      if(this.props.orientation === 'vertical') {
        this.scrollerRef.scrollTop = scrollOffset;
      }
      else {
        this.scrollerRef.scrollLeft = scrollOffset;
      }
    }
  }

  public shouldComponentUpdate(nextProps: ScrollerProps) {
    const { margin, visible, size, virtualSize, scrollOffset, orientation } = this.props;
    if(nextProps.margin !== margin ||
       nextProps.visible !== visible ||
       nextProps.orientation !== orientation ||
       nextProps.size !== size ||
       nextProps.virtualSize !== virtualSize) {
      return true;
    }

    if(nextProps.scrollOffset !== scrollOffset) {
      this.setScrollOffset(nextProps.scrollOffset);
    }
    return false;
  }

  public componentDidMount() {
    this.setScrollOffset(this.props.scrollOffset);
  }

  public componentDidUpdate() {
    this.setScrollOffset(this.props.scrollOffset);
  }

  @autobind
  private setScrollerRef(ref: HTMLDivElement) {
    this.scrollerRef = ref;
  }

  public render() {
    const { margin, visible, size, virtualSize, orientation } = this.props;
    let scrollerStyle: React.CSSProperties = {
      position: 'absolute',
      display: visible ? 'block' : 'none'
    };
    let viewPortStyle: React.CSSProperties;
    if(orientation === 'vertical') {
      scrollerStyle = {...scrollerStyle,
        right: '0px',
        top: `${margin}px`,
        bottom: 0,
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: size ? `${size}px` : undefined,
        width: '15px'
      };
      viewPortStyle = {
        width: '1px',
        height: `${virtualSize}px`
      };
    }
    else {
      scrollerStyle = {...scrollerStyle,
        bottom: '0px',
        left: `${margin}px`,
        overflowX: 'scroll',
        overflowY: 'hidden',
        width: size ? `${size}px` : undefined,
        height: '15px'
      };
      viewPortStyle = {
        height: '1px',
        width: `${virtualSize}px`
      };
    }
    return (
      <div
        className='virtual-table-scroller'
        onScroll={this.throttledOnScroll}
        ref={this.setScrollerRef}
        style={scrollerStyle}
      >
        <div style={viewPortStyle} />
      </div>
    );
  }
}
