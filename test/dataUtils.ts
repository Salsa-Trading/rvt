import * as _ from 'lodash';
import {TableRowProps} from '../src/VirtualTable';
import {times, random} from 'lodash';

const longString = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas interdum',
  'enim erat, non lobortis risus imperdiet at. Sed luctus felis quam, eget',
  'elementum metus convallis et. Mauris vehicula diam ut eros rutrum, eu blandit',
  'erat blandit. Curabitur ultricies pretium nisl in semper. Duis in justo neque.',
  'Mauris tristique, neque eget lobortis elementum, libero lectus interdum dolor,',
  'ac pulvinar enim odio dictum tellus. Sed sapien dolor, pharetra sit amet',
  'sodales sed, semper in turpis. Nunc vel vulputate purus, consectetur posuere',
  'ligula. Vivamus vulputate fermentum fringilla. Ut sagittis consequat lorem, a',
  'tempor sapien vehicula fermentum. Nulla tincidunt orci mi, non bibendum erat',
  'auctor eu. Morbi consectetur lorem ligula, nec interdum odio porta sit amet.',
  'Nullam a tristique tortor. Aenean faucibus et nibh a interdum. Mauris sit',
  'amet risus interdum, interdum elit nec, molestie justo.'
].join(' ');

export type SampleData = {
  col1: number;
  col2: string;
  col3: boolean;
  col4: number;
  col5: number;
  col6: string;
  ['string']?: string | number;
};

export function generateWideTableDataForSlice(index: number, addtionalColumns, count: number): SampleData[] {
  return _.range(index, index + count).map(i => {
    return generateWideDataForIndex(i, addtionalColumns);
  });
}

export function generateDataForIndex(index: number): SampleData {
  return {
    col1: index,
    col2: (40960 + index).toString(16),
    col3: Boolean(index % 2),
    col4: 1000 * random(),
    col5: Math.sin(index),
    col6: 'test data'
  };
}

export function generateWideDataForIndex(index: number, addtionalColumns: number): SampleData {
  const extendedCols = {};
  times(addtionalColumns, (i) => {
    extendedCols[`col${i + 7}`] = random(0, 10000);
  });

  return {
    ...generateDataForIndex(index),
    ...extendedCols
  };
}


export function generateDataForSlice(index: number, count: number): SampleData[] {
  return _.range(index, index + count).map(i => generateDataForIndex(i));
}

export function generateData(rowCount): SampleData[] {
  const array = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    array[i] = generateDataForIndex(i);
  }
  return array;
}

export function generateWideData(rowCount, addtionalColumns: number): SampleData[] {
  const array = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    array[i] = generateWideDataForIndex(i, addtionalColumns);
  }
  return array;
}

export function generateRowDataForIndex(index: number): TableRowProps<SampleData>  {
  return {
    data: generateDataForIndex(index)
  };
}

export function generateRowDataSlice(index: number, count: number): TableRowProps<SampleData>[] {
  return generateDataForSlice(index, count).map(data => ({data}));
}
