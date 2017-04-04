import * as React from 'react';
import { shallow } from 'enzyme';
import { Grid, Field } from '../src/index';
import { generateRowDataForIndex } from './dataUtils';

describe('<Grid />', () => {

  const defaultProps = {
    getRow: generateRowDataForIndex,
    rowCount: 0
  };

  let wrapper;

  describe('root element', () => {

    let onListStateChanged;

    beforeEach(() => {
      const props = Object.assign({}, defaultProps, {
        onListStateChanged,
        listState: {}
      });

      wrapper = shallow(<Grid {...props}>
        <Field header='Col 1' field='col1' sortable />
        <Field header='Col 2' field='col2' filterable sortDirection='desc' />
      </Grid>);
    });

  });

});
