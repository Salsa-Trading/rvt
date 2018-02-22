/* tslint:disable:no-unused-expression */

import * as React from 'react';
import { expect } from 'chai';
import { FieldDefinition } from '../../src/List/Field';
import { FieldSetDefinition, FieldSet, FieldSetDisplay } from '../../src/List/FieldSet';

describe('<FieldSet />', () => {

  describe('root element', () => {

    let fieldSet: FieldSet;

    beforeEach(() => {

      let defs = (
        <FieldSetDefinition name='_root_'>
          <FieldSetDefinition header='Group 1' name='group1'>
            <FieldDefinition header='Col 1' name='col1' />
            <FieldDefinition header='Col 2' name='col2' />
          </FieldSetDefinition>
          <FieldDefinition header='Col 1' name='col1' />
          <FieldDefinition header='Col 2' name='col2' />
        </FieldSetDefinition>
      );

      fieldSet = new FieldSet(defs.props, null, null);
    });

    it('should have 2 levels', () => {
      expect(fieldSet.getLevelCount()).to.equal(2);
    });
  });

  describe('field defs and stored differences', () => {

    let defs: any;

    beforeEach(() => {
      defs = (
        <FieldSetDefinition header='Group 1' name='group1'>
          <FieldDefinition header='Col 1' name='col1' />
          <FieldDefinition header='Col 2' name='col2' />
        </FieldSetDefinition>
      );
    });

    it('should ingore fields not in def', () => {
      const fields: FieldSetDisplay = {
        name: 'group1',
        hidden: false,
        children: [
          {name: 'col1', hidden: false},
          {name: 'col2', hidden: false},
          {name: 'missingCol', hidden: false}
        ]
      };
      const fieldSet = new FieldSet(defs.props, null, fields);
      expect(fieldSet.children.map(c => c.name)).to.deep.equal(['col1', 'col2']);
    });

    it('should include defs not in fields', () => {
      const fields: FieldSetDisplay = {
        name: 'group1',
        hidden: false,
        children: [
          {name: 'col1', hidden: false}
        ]
      };
      const fieldSet = new FieldSet(defs.props, null, fields);
      expect(fieldSet.children.map(c => c.name)).to.deep.equal(['col1', 'col2']);
    });

    it('should preserve fieldDisplay order', () => {
      const fields: FieldSetDisplay = {
        name: 'group1',
        hidden: false,
        children: [
          {name: 'col2', hidden: false},
          {name: 'col1', hidden: false}
        ]
      };
      const fieldSet = new FieldSet(defs.props, null, fields);
      expect(fieldSet.children.map(c => c.name)).to.deep.equal(['col2', 'col1']);
    });

  });


});
