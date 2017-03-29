import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Grid, Column } from '../src/index';
import { generateRowDataForIndex } from './dataUtils';

describe('<Grid />', () => {

  const defaultProps = {
    getRow: generateRowDataForIndex,
    rowCount: 0
  };

  let wrapper;

  describe('root element', () => {

    let onGridStateChanged;

    beforeEach(() => {
      const props = Object.assign({}, defaultProps, {
        onGridStateChanged,
        gridState: {}
      });

      wrapper = shallow(<Grid {...props}>
        <Column header='Col 1' field='col1' sortable />
        <Column header='Col 2' field='col2' filterable sortDirection='desc' />
      </Grid>);
    });

  });

});
