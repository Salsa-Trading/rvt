import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SortIndicator from '../src/SortIndicator';
import SortDirection from '../src/SortDirection';

describe('<SortIndicator />', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SortIndicator />);
  });

  it('should have a div with class sortIndicator', () => {
    const div = wrapper.first();
    expect(div.is('div')).to.be.true;
    expect(div).to.have.className('sortIndicator');
  });

  it('should have an ascending button', () => {
    expect(wrapper.find('.ascending')).to.have.length(1);
  });

  it('should have an ascending button', () => {
    expect(wrapper.find('.descending')).to.have.length(1);
  });

  describe('click handler', () => {

    let onClickSpy;

    beforeEach(() => {
      onClickSpy = sinon.spy();
      wrapper = shallow(<SortIndicator onSortSelection={onClickSpy} />);
    });

    it('should raise onClick with ascending', () => {
      wrapper.find('.ascending').simulate('click');
      expect(onClickSpy).to.have.been.calledWith(SortDirection.ASCENDING);
    });

    it('should raise onClick with descending', () => {
      wrapper.find('.descending').simulate('click');
      expect(onClickSpy).to.have.been.calledWith(SortDirection.DESCENDING);
    });

  });

  describe('selected sort direction', () => {

    it('should default to SortDirection.NONE', () => {
      wrapper = mount(<SortIndicator />);
      expect(wrapper.prop('sortDirection')).to.equal(SortDirection.NONE);
    });

    it('should have selected class when sortDirection is ascending', () => {
      wrapper = shallow(<SortIndicator sortDirection={SortDirection.ASCENDING} />);
      expect(wrapper.find('.ascending .selected')).to.have.length(1);
    });

    it('should have selected class when sortDirection is descending', () => {
      wrapper = shallow(<SortIndicator sortDirection={SortDirection.DESCENDING} />);
      expect(wrapper.find('.descending .selected')).to.have.length(1);
    });
  });

});

