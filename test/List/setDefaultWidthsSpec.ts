import {FieldDisplay} from '../../src/List/Field';
import {setDefaultWidths} from '../../src/List/setDefaultWidths';
import {expect} from 'chai';

describe('setDefaultWidth', () => {
  describe('when a fieldSet has no children', () => {
    it('sets a default width when missing', () => {
      const fields: FieldDisplay = {
        name: 'root'
      };

      expect(setDefaultWidths(fields)).to.eq({
        name: 'root',
        width: 50
      });
    });

    it('keeps the current width if the fieldSet has one'. () => {

    });
  });

  describe('when a fieldSet hsa children', () => {
    it('sets the width to the sum of its children', () => {

    });
  });
});