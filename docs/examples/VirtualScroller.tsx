import * as React from 'react';
import {Scroller} from '../../src/index';
import {autobind} from 'core-decorators';

export default class VirtualScroller extends React.Component<{}, {
  scrollOffset: number;
  virtualSize: number;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scrollOffset: 0,
      virtualSize: 1000
    };
  }

  @autobind
  public onScroll(scrollOffset: number) {
    this.setState({scrollOffset});
  }

  @autobind
  public setVirtualSize(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({virtualSize: parseFloat(e.currentTarget.value)});
  }

  @autobind
  public setScrollOffset(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({scrollOffset: parseFloat(e.currentTarget.value)});
  }

  public render() {
    const {scrollOffset, virtualSize} = this.state;
    const divStyle = {
      height: '100px',
      width: '100px'
    };
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-1'>
            <div style={divStyle}>
              <Scroller margin={0} size={100} virtualSize={virtualSize} visible={true} onScroll={this.onScroll} scrollOffset={scrollOffset} />
            </div>
          </div>
          <div className='col-md-1' />
          <div className='col-md-1'>
            <div style={divStyle}>
              <Scroller orientation='horizontal' margin={0} size={100} virtualSize={virtualSize} visible={true} onScroll={this.onScroll} scrollOffset={scrollOffset} />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='form-group row'>
              <label htmlFor='virtualSize' className='col-sm-2 col-form-label'>Virtual Size</label>
              <div className='col-sm-4'>
                <input type='number' className='form-control' id='virtualSize' value={virtualSize} onChange={this.setVirtualSize} />
              </div>
            </div>
            <div className='form-group row'>
              <label htmlFor='scrollOffset' className='col-sm-2 col-form-label'>Scroll Offset</label>
              <div className='col-sm-4'>
                <input type='number' className='form-control' id='scrollOffset' value={scrollOffset} onChange={this.setScrollOffset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
