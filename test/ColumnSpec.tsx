import * as React from 'react';
import { expect } from 'chai';
import { ColumnDefinition, ColumnGroupDefinition, ColumnGroup } from '../src/Column';

describe('<ColumnGroup />', () => {

  describe('root element', () => {

    let columnGroup: ColumnGroup;

    beforeEach(() => {

      let defs = (
        <ColumnGroupDefinition field='_root_'>
          <ColumnGroupDefinition header='Group 1' field='group 1'>
            <ColumnDefinition header='Col 1' field='col1' />
            <ColumnDefinition header='Col 2' field='col2' />
          </ColumnGroupDefinition>
          <ColumnDefinition header='Col 1' field='col1' />
          <ColumnDefinition header='Col 2' field='col2' />
        </ColumnGroupDefinition>
      );

      columnGroup = new ColumnGroup(defs.props, null, null);
    });

    it('should have 2 levels', () => {
      expect(columnGroup.getLevelCount()).to.equal(2);
    });


  });

});
