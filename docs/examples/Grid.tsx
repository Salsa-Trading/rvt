import * as React from 'react';
import { Grid, Column, SortDirections, SortDirection } from '../../src/index';
import { generateData } from '../../test/dataUtils';
import * as _ from 'lodash';

import '../../src/styles/grid.scss';

export default class GridExample extends React.Component<{
}, {
  data?: any[];
  sortColumns?: any;
  columnWidths?: any;
  columnOrder?: string[]
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: generateData(500),
      sortColumns: {},
      columnWidths: {
        col1: 150,
        col2: 150,
        col3: 250
      },
      columnOrder: [
        'col1',
        'col2',
        'col3',
        'col4',
        'col5'
      ]
    };
  }

  public getRow(index: number) {
    return {
      data: this.state.data[index],
      className: index % 2 ? 'even' : 'odd'
    };
  };

  public onSortSelection(sortDirection: SortDirections, column: any) {
    let { data } = this.state;
    const { field } = column;
    let { sortColumns } = this.state;
    sortColumns = Object.assign({}, sortColumns);
    sortColumns[field] = sortDirection;
    data = _.orderBy(data, [field], [sortDirection === SortDirection.ASCENDING ? 'asc' : 'desc']);
    this.setState({sortColumns, data});
  }

  public onWidthChanged(width: number, column: any) {
    const { field } = column;
    const columnWidths = Object.assign({}, this.state.columnWidths);
    columnWidths[field] = width;
    this.setState({columnWidths});
  }

  public onColumnMove(column: any, previousIndex: number, newIndex: number) {
    const columnOrder = this.state.columnOrder.slice(0);
    columnOrder.splice(newIndex, 0, columnOrder.splice(previousIndex, 1)[0]);
    this.setState({columnOrder});
  }

  public render() {
    const { sortColumns, columnWidths, columnOrder } = this.state;
    const columnIndexes = (columnOrder.reduce((a, k, i) => { a[k] = i; return a; }, {} as any)) as any;
    return (
      <div style={{height: 1200}}>
        <Grid
          getRow={this.getRow.bind(this)}
          rowCount={this.state.data.length}
          onSortSelection={this.onSortSelection.bind(this)}
          onWidthChanged={this.onWidthChanged.bind(this)}
          onColumnMove={this.onColumnMove.bind(this)}
          className='table table-bordered table-condensed' >

          <Column name='Col 1'
            key='col1'
            field='col1'
            index={columnIndexes.col1}
            canSort
            sortDirection={sortColumns.col1}
            width={columnWidths.col1} />

          <Column name='Col 2'
            key='col2'
            field='col2'
            index={columnIndexes.col2}
            canSort
            sortDirection={sortColumns.col2}
            width={columnWidths.col2} />

          <Column name='Col 3'
            key='col3'
            field='col3'
            index={columnIndexes.col3}
            width={columnWidths.col3}
            format={(data) => data.col4.toLocaleString()}
          />

          <Column name='Col 4'
            key='col4'
            field='col4'
            index={columnIndexes.col4}
            width={columnWidths.col4}
            format={(data) => data.col3.toString()}
          />

          <Column name='Col 5'
            key='col5'
            field='col5'
            index={columnIndexes.col5}
            width={columnWidths.col5}
            format={(data) => data.col5.toFixed(4)}
          />

        </Grid>
      </div>
    );
  }
}
