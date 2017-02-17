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
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: generateData(50),
      sortColumns: {},
      columnWidths: {
        col1: 150,
        col2: 150,
        col3: 150
      }
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

  public render() {
    const { sortColumns, columnWidths } = this.state;
    return (
      <div style={{height: 500}}>
        <Grid
          getRow={this.getRow.bind(this)}
          rowCount={this.state.data.length}
          onSortSelection={this.onSortSelection.bind(this)}
          onWidthChanged={this.onWidthChanged.bind(this)}
          className='table table-bordered table-condensed' >

          <Column name='Col 1'
            field='col1'
            canSort sortDirection={sortColumns.col1}
            width={columnWidths.col1} />

          <Column name='Col 2'
            field='col2'
            canSort
            sortDirection={sortColumns.col2}
            width={columnWidths.col2} />

          <Column name='Col 3'
            field='col3'
            width={columnWidths.col3}
            format={(data) => data.col4.toLocaleString()}
          />

          <Column name='Col 4'
            field='col4'
            width={columnWidths.col4}
            format={(data) => data.col3.toString()}
          />

          <Column name='Col 5'
            field='col5'
            width={columnWidths.col5}
            format={(data) => data.col5.toFixed(4)}
          />

        </Grid>
      </div>
    );
  }
}
