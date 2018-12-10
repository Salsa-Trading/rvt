/* tslint:disable:no-unused-expression */

import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Scroller from '../src/Scroller';

describe('<Scroller />', () => {

  let props = {
    margin: 10,
    size: 100,
    virtualSize: 1000,
    visible: true,
    scrollOffset: 0,
    onScroll: null
  };
  let wrapper, div;
  let onScrollSpy;

  describe('common', () => {

    beforeEach(() => {
      props.onScroll = onScrollSpy = sinon.spy();
      wrapper = mount(<Scroller {...props} />);
      div = wrapper.first('.virtual-table-scroller');
    });

    it('should call internal onScroll when the div is scrolled', () => {
      wrapper = mount(<Scroller {...props} />);
      div = wrapper.first('.virtual-table-scroller');
      div.simulate('scroll');
      expect(onScrollSpy).to.have.been.called;
    });

    it('should have a div with class virtual-table-scroller', () => {
      expect(div).to.be;
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
        // viewPortDiv = div.childAt(0);
        // Single div.childAt(0) used to work and seems correct, but now multiple childAt are necessary
        viewPortDiv = div.childAt(0).childAt(0);
      });

      it('sould have a viewPort div', () => {
        expect(viewPortDiv).to.be;
      });

      it('sould have a viewPort div with height = ${props.virtualSize}', () => {
        expect(viewPortDiv).to.have.style('height', `${props.virtualSize}px`);
      });

    });

  });


  describe('vertical layout', () => {

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

    it('should have a div with top = {props.margin}px style', () => {
      expect(div).to.have.style('top', `${props.margin}px`);
    });

  });

  describe('horizontal layout', () => {

    beforeEach(() => {
      props.onScroll = onScrollSpy = sinon.spy();
      wrapper = mount(<Scroller {...props} orientation='horizontal' />);
      div = wrapper.first('.virtual-table-scroller');
    });


    it('should have a div with absolute style, overflowX hidden, overflowY scroll', () => {
      expect(div).to.have.style('position', 'absolute');
      expect(div).to.have.style('overflowY', 'hidden');
      expect(div).to.have.style('overflowX', 'scroll');
    });

    it('should have a div with bottom = 0px style', () => {
      expect(div).to.have.style('bottom', '0px');
    });

    it('should have a div with height = 15px style', () => {
      expect(div).to.have.style('height', '15px');
    });

    it('should have a div with width = {props.size}px style', () => {
      expect(div).to.have.style('width', `${props.size}px`);
    });

    it('should have a div with left = {props.margin}px style', () => {
      expect(div).to.have.style('left', `${props.margin}px`);
    });

  });



});
