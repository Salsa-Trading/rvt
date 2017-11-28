import * as React from 'react';
import {Scroller} from '../../src/index';
import {autobind} from 'core-decorators';

export default class VirtualScroller extends React.Component<{}, {
  scrollOffset: number;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scrollOffset: 0
    };
  }

  @autobind
  public onScroll(scrollOffset: number) {
    this.setState({scrollOffset});
    console.log(scrollOffset);
  }

  public render() {
    const {scrollOffset} = this.state;
    const divStyle = {
      height: '100px',
      width: '100px'
    };
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-1'>
            <div style={divStyle}>
              <Scroller margin={0} size={100} virtualSize={1000} visible={true} onScroll={this.onScroll} scrollOffset={scrollOffset} />
            </div>
          </div>
          <div className='col-sm-1'>
            <div style={divStyle}>
              <Scroller orientation='horizontal' margin={0} size={100} virtualSize={1000} visible={true} onScroll={this.onScroll} scrollOffset={scrollOffset} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
