import * as React from 'react';
import { Grid, Column, SortDirections } from '../../src/index';
import { generateData } from '../../test/dataUtils';
import * as _ from 'lodash';

export default class GridExample extends React.Component<{
}, {
  data?: any[];
  sortColumns?: any;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: generateData(500000),
      sortColumns: {},
    };
  }

  public getRow(index: number) {
    return {
      data: this.state.data[index],
      className: index % 2 ? 'even' : 'odd'
    };
  };

  public onSortSelection(sortDirection: SortDirections, column: any) {
    const { field } = column;
    let sortColumns = this.state;
    sortColumns = Object.assign({}, sortColumns);
    sortColumns[field] = sortDirection;
    this.setState({sortColumns});
  }

  public render() {
    return (
      <div style={{height: 500}}>
        <Grid
          getRow={this.getRow.bind(this)}
          rowCount={this.state.data.length}
          onSortSelection={this.onSortSelection.bind(this)}
          className='table table-bordered table-condensed' >

          <Column name='Col 1' field='col1' canSort />
          <Column name='Col 2' field='col2' canSort />

          <Column name='Col 4'
            format={(data) => data.col4.toLocaleString()}
          />

          <Column name='Col 3'
            format={(data) => data.col3.toString()}
          />

          <Column name='Col 5'
            format={(data) => data.col5.toFixed(4)}
          />

        </Grid>
      </div>
    );
  }
}
