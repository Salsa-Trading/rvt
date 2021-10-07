import * as React from 'react';
import { expect } from 'chai';

import { FieldSet as FieldSetClass} from '../../src/List/FieldSet';
import { Field, FieldSet } from '../../src/';
import {getLevels} from '../../src/Grid/helpers';

function equalLevels(result, expected) {
  if(result.length !== expected.length) {
    throw new Error(`rows not equal, expected ${result.length} to equal ${expected.length}`);
  }
  for(let x = 0; x < result.length; x++) {
    if(result[x].length !== expected[x].length) {
      throw new Error(`cols not equal, expected ${result[x].length} to equal ${expected[x].length}`);
    }
    for(let y = 0; y < result[x].length; y++) {
      let resultField = result[x][y];
      let expectedField = expected[x][y];
      if(resultField.field.name !== expectedField.field.name) {
        throw new Error(`expected field.name ${resultField.field.name} to equal ${expectedField.field.name} [${x},${y}]`);
      }
      if(resultField.rowSpan !== expectedField.rowSpan) {
        throw new Error(`expected rowSpan ${resultField.rowSpan} to equal ${expectedField.rowSpan} [${x},${y}]`);
      }
      if(resultField.colSpan !== expectedField.colSpan) {
        throw new Error(`expected colSpan ${resultField.colSpan} to equal ${expectedField.colSpan} [${x},${y}]`);
      }
    }
  }

}

describe('<GridHeader />', () => {

  describe('getLevels', () => {

    it('should get simple fields', () => {
      const fields = (
        <FieldSet name='__root'>
          <Field name='field1' />
          <Field name='field2' />
          <Field name='field3' />
        </FieldSet>
      );

      const fieldSet = new FieldSetClass(fields.props, {}, null);
      expect(fieldSet.getLevelCount()).to.eq(1);
      expect(equalLevels(getLevels(fieldSet), [[
        {field: {name: 'field1'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field2'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field3'}, colSpan: 1, rowSpan: 1}
      ]]));
    });

    it('should get a mix of top level fields & field sets', () => {
      const fields = (
        <FieldSet name='__root'>
          <FieldSet name='group1' />
          <Field name='field1' />
          <Field name='field2' />
          <Field name='field3' />
        </FieldSet>
      );

      const fieldSet = new FieldSetClass(fields.props, {}, null);
      expect(fieldSet.getLevelCount()).to.eq(1);
      expect(equalLevels(getLevels(fieldSet), [[
        {field: {name: 'field1'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field2'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field3'}, colSpan: 1, rowSpan: 1}
      ]]));
    });

    it('should get 2 rows for top level fieldSets', () => {
      const fields = (
        <FieldSet name='__root'>
          <FieldSet name='group1'>
            <Field name='field1' />
            <Field name='field2' />
          </FieldSet>
          <FieldSet name='group2'>
            <Field name='field3' />
            <Field name='field4' />
          </FieldSet>
        </FieldSet>
      );

      const fieldSet = new FieldSetClass(fields.props, {}, null);
      expect(fieldSet.getLevelCount()).to.eq(2);
      expect(equalLevels(getLevels(fieldSet), [[
        {field: {name: 'group1'}, colSpan: 2, rowSpan: 1},
        {field: {name: 'group2'}, colSpan: 2, rowSpan: 1}
      ], [
        {field: {name: 'field1'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field2'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field3'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field4'}, colSpan: 1, rowSpan: 1}
      ]]));
    });

    it('should get 3 rows for jagged fieldSets', () => {
      const fields = (
        <FieldSet name='__root'>
          <FieldSet name='group1'>
            <FieldSet name='group2'>
              <Field name='field1' />
              <Field name='field2' />
            </FieldSet>
          </FieldSet>
          <FieldSet name='group3'>
            <Field name='field3' />
            <Field name='field4' />
          </FieldSet>
        </FieldSet>
      );

      const fieldSet = new FieldSetClass(fields.props, {}, null);
      expect(fieldSet.getLevelCount()).to.eq(3);
      expect(equalLevels(getLevels(fieldSet), [[
        {field: {name: 'group1'}, colSpan: 2, rowSpan: 1},
        {field: {name: 'group3'}, colSpan: 2, rowSpan: 1}
      ], [
        {field: {name: 'group2'}, colSpan: 2, rowSpan: 1},
        {field: {name: 'field3'}, colSpan: 1, rowSpan: 2},
        {field: {name: 'field4'}, colSpan: 1, rowSpan: 2}
      ], [
        {field: {name: 'field1'}, colSpan: 1, rowSpan: 1},
        {field: {name: 'field2'}, colSpan: 1, rowSpan: 1}
      ]]));
    });

  });

});

