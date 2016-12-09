import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Scroller from '../src/Scroller';

describe('<SortIndicator />', () => {

  let props = {
    top: 10,
    height: 100,
    viewPortHeight: 1000,
    visible: true,
    scrollTop: 0,
    onScroll: null
  };
  let wrapper, div;
  let onScrollSpy;

  beforeEach(() => {
    props.onScroll = onScrollSpy = sinon.spy();
    wrapper = mount(<Scroller {...props } />);
    div = wrapper.first('.virtual-table-scroller');
  });

  it('should have a div with class virtual-table-scroller', () => {
    expect(div).to.be;
  });

  it('should have a div with absolute style, overflowX hidden, overflowY scroll', () => {
    expect(div).to.have.style('position', 'absolute');
    expect(div).to.have.style('overflowY', 'scroll');
    expect(div).to.have.style('overflowX', 'hidden');
  });

  it('should have a div with right = 0px style', () => {
    expect(div).to.have.style('right', '0px');
  });

  it('should have a div with width = 15px style', () => {
    expect(div).to.have.style('width', '15px');
  });

  it('should have a div with height = {props.height}px style', () => {
    expect(div).to.have.style('height', `${props.height}px`);
  });

  it('should have a div with top = {props.top}px style', () => {
    expect(div).to.have.style('top', `${props.top}px`);
  });

  it('should have a div with display = block style when visible', () => {
    expect(div).to.have.style('display', 'block');
  });

  it('should have a virtual div for viewPort', () => {
    expect(wrapper.find('.virtual-table-scroller > div')).to.have.length(1);
  });

  describe('viewPort', () => {

    let viewPortDiv;

    beforeEach(() => {
      viewPortDiv = div.childAt(0);
    });

    it('sould have a viewPort div', () => {
      expect(viewPortDiv).to.be;
    });

    it('sould have a viewPort div with height = ${props.viewPortHeight}', () => {
      expect(viewPortDiv).to.have.style('height', `${props.viewPortHeight}px`);
    });

  });

  it('should call internal onScroll when the div is scrolled', () => {
    wrapper = mount(<Scroller {...props } />);
    div = wrapper.first('.virtual-table-scroller');
    div.simulate('scroll');
    expect(onScrollSpy).to.have.been.called;
  });

});
