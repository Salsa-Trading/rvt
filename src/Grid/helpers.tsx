import * as React from 'react';
import { Field } from '../List/Field';
import * as get from 'lodash.get';
import isNil from '../utils/isNil';
import { GridRowHeaderProps } from './types';

export function renderGridCell<TData>(field: Field, data: TData) {
  if(field.cell) {
    if(React.isValidElement(field.cell)) {
      return React.cloneElement(field.cell as any, {field, data});
    }
    else {
      return React.createElement(field.cell as any, {field, data});
    }
  }
  else if(field.format) {
    return field.format(data, field);
  }
  else {
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


