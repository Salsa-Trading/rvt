import {flatten, get} from 'lodash';
import * as React from 'react';
import {Field, FieldBase} from '../List/Field';
import isNil from '../utils/isNil';
import {GridRowHeaderProps} from './types';

import {FieldSet, isVisible} from '../List/FieldSet';

export function renderGridCell<TData>(field: Field, data: TData) {
  if(field.cell) {
    if(React.isValidElement(field.cell)) {
      return React.cloneElement(field.cell as any, {field, data});
    } else {
      return React.createElement(field.cell as any, {field, data});
    }
  } else if(field.format) {
    return field.format(data, field);
  } else {
    const value = get(data, field.name);
    return isNil(value) ? value : value.toString();
  }
}

export function renderGridRowHeader<TData>(rowHeaderComponent: React.ComponentType<GridRowHeaderProps<TData>>, data: TData, rowSpan = 1) {
  if(!rowHeaderComponent) {
    return null;
  }
  return (
    <th rowSpan={rowSpan}>
      {React.createElement(rowHeaderComponent, {data})}
    </th>
  );
}


export type FieldHeader = {
  field: FieldBase;
  rowSpan: number;
  colSpan: number;
};

export function fillLevels(fieldSet: FieldSet, rows: number): FieldHeader[][] {
  const level: FieldHeader[] = [];
  const levels = [level];
  for(const child of fieldSet.children.filter(f => isVisible(f))) {
    if(child instanceof FieldSet) {
      level.push({field: child, colSpan: child.getFieldCount(), rowSpan: 1});
      const subLevels = fillLevels(child, rows - 1);
      for(let i = 0; i < subLevels.length; i++) {
        if(subLevels[i] && subLevels[i].length > 0) {
          levels[i + 1] = (levels[i + 1] || []).concat(subLevels[i]);
        }
      }
    } else if(child instanceof Field) {
      level.push({field: child, colSpan: 1, rowSpan: Math.max(rows, 1)});
    }
  }
  return levels;
}

export function getLevels(fieldSet: FieldSet): FieldHeader[][] {
  const maxRows = fieldSet.getLevelCount();
  return fillLevels(fieldSet, maxRows);
}

export function allFieldSetWidthsSet(fieldSet: FieldSet): boolean {
  const rows: FieldBase[] = flatten(getLevels(fieldSet)).map((r) => r.field);
  return rows.every((r: FieldBase) => r.hidden || r.width);
}
