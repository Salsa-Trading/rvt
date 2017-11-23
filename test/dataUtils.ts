import * as _ from 'lodash';

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

export function generateDataForIndex(index: number) {
  return {
    col1: index,
    col2: (40960 + index).toString(16),
    col3: Boolean(index % 2),
    col4: new Date(1451628000000 + 10800000 * index),
    col5: Math.sin(index),
    col6: longString
  };
}

export function generateDataForSlice(index: number, count: number) {
  return _.range(index, count).map(i => generateDataForIndex(i));
}

export function generateRowDataForIndex(index: number) {
  return {
    data: generateDataForIndex(index)
  };
}

export function generateRowDataSlice(index: number, count: number) {
  return generateDataForSlice(index, count).map(data => ({data}));
}

export function generateData(rowCount) {
  const array = new Array(rowCount);
  for (let i = 0; i < rowCount; i++) {
    array[i] = generateDataForIndex(i);
  }
  return array;
}
