/* tslint:disable:no-unused-expression */

import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { VirtualTable } from '../src/index';
import { generateRowDataForIndex } from './dataUtils';

describe('<Table />', () => {

  const defaultProps = {
    getRow: generateRowDataForIndex,
    rowCount: 0,
    header: () => { return null; },
    row: () => { return null; }
  };

  let wrapper;
  let mounted;

  describe('root element', () => {

    beforeEach(() => {
      const props = Object.assign({}, defaultProps, {
        rowCount: 0,
        width: 500,
        height: 500,
        headerHeight: 25,
        rowHeight: 20
      });

      wrapper = shallow(<VirtualTable {...props} />);
    });

    it('should render a root level DIV element', () => {
      expect(wrapper.first().is('div')).to.be.true;
    });

    it('should have a root DIV with position:relative & display:inline-block ', () => {
      const div = wrapper.first();
      expect(div).to.have.style('position', 'relative');
      expect(div).to.have.style('display', 'inline-block');
    });

    it('should contain 1 TABLE element', () => {
      expect(wrapper).to.have.exactly(1).descendants('table');
    });

  });

  describe('static layout', () => {

    beforeEach(() => {
      const props = Object.assign({}, defaultProps, {
        rowCount: 100,
        width: 500,
        height: 500,
        headerHeight: 25,
        rowHeight: 20
      });

      wrapper = shallow(<VirtualTable {...props} />);
    });

    it('should calculate visibleRows after construction', () => {
      expect(wrapper).to.have.state('maxVisibleRows', 23);
    });

  });

  describe('explicit heights', () => {

    beforeEach(() => {
      const props = Object.assign({}, defaultProps, {
        rowCount: 100,
        height: 500,
        headerHeight: 25,
        rowHeight: 20
      });

      wrapper = shallow(<VirtualTable {...props} />);
    });

    it('should calculate visibleRows after construction', () => {
      expect(wrapper).to.have.state('maxVisibleRows', 23);
    });

  });

  describe('calculated heights', () => {

    describe('initial render', () => {

      beforeEach(() => {
        const props = Object.assign({}, defaultProps, {
          rowCount: 100
        });

        wrapper = shallow(<VirtualTable {...props} />);
      });

      it('should set visibleRows equal to 10 after construction', () => {
        expect(wrapper).to.have.state('maxVisibleRows', 10);
      });

      it('should have calculator div', () => {
        const div = wrapper.first();
        expect(div).to.have.className('calculator');
      });
    });

    describe('on mount', () => {

      beforeEach(() => {
        const props = Object.assign({}, defaultProps, {
          rowCount: 100
        });

        mounted = mount(<VirtualTable {...props} />);
      });

      it('should set visibleRows equal to 10 after construction', () => {
        expect(mounted).to.have.state('maxVisibleRows', 10);
      });

      it('should have calculoator div until after mount & re-render', () => {
        const div = mounted.first();
        expect(div).to.have.className('calculator');
      });

    });
  });
});
