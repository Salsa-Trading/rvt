/* tslint:disable:no-unused-expression */

import * as React from 'react';
import { expect } from 'chai';
import { FieldDefinition } from '../src/List/Field';
import { FieldSetDefinition, FieldSet } from '../src/List/FieldSet';

describe('<FieldSet />', () => {

  describe('root element', () => {

    let columnGroup: FieldSet;

    beforeEach(() => {

      let defs = (
        <FieldSetDefinition name='_root_'>
          <FieldSetDefinition header='Group 1' name='group 1'>
            <FieldDefinition header='Col 1' name='col1' />
            <FieldDefinition header='Col 2' name='col2' />
          </FieldSetDefinition>
          <FieldDefinition header='Col 1' name='col1' />
          <FieldDefinition header='Col 2' name='col2' />
        </FieldSetDefinition>
      );

      columnGroup = new FieldSet(defs.props, null, null);
    });

    it('should have 2 levels', () => {
      expect(columnGroup.getLevelCount()).to.equal(2);
    });
  });
});
