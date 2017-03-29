import * as React from 'react';
import * as _ from 'lodash';
import { Grid, Column, GridState, GridStateChangeType, isDataChange, RowData } from '../../src/index';
import { generateData } from '../../test/dataUtils';

import '../../src/styles/grid.scss';

export default class GridExample extends React.Component<{
}, {
  originalData?: any[];
  data?: any[]
  gridState?: GridState
}> {

  constructor(props, context) {
    super(props, context);
    const originalData = generateData(500);
    this.state = {
      originalData,
      data: originalData
    };
  }

  public getRow(index: number): RowData {
    return {
      data: this.state.data[index],
      rowProps: {
        style: {backgroundColor: index % 2 === 0 ? '' : 'lightgray'}
      }
    };
  };

  private onGridStateChanged(gridState: GridState, changeType: GridStateChangeType) {
    if(!isDataChange(changeType)) {
      return this.setState({gridState});
    }

    let { data } = this.state;
    if(changeType === GridStateChangeType.filter) {
      data = this.state.originalData;
      for(let field of Object.keys(gridState.filter)) {
        data = data.filter(d => _.some(gridState.filter[field], (filter) => filter ===  (_.get(d, field) as string || '')));
      }
    }

    if(gridState.sort && gridState.sort.length > 0) {
      data = _.orderBy(data, [gridState.sort[0].field], [gridState.sort[0].direction]);
    }

    this.setState({gridState, data});
  }

  public render() {
    const { gridState } = this.state;
    return (
      <div style={{height: 1200}}>
        <Grid
          getRow={this.getRow.bind(this)}
          rowCount={this.state.data.length}
          gridState={gridState}
          onGridStateChanged={this.onGridStateChanged.bind(this)}
          className='table table-bordered table-condensed'
          columnDefaults={{sortable: true, filterable: true}}>

          <Column header='Col 1' field='col1' sortable  />
          <Column header='Col 2' field='col2' filterable sortDirection='desc' />
          <Column header='Col 3' field='col3' cell={d => <input type='checkbox' checked={d.col3} /> } />
          <Column header='Col 4' field='col4' cell={(d) => d.col4.toString()} />
          <Column header='Col 5' field='col5' />

        </Grid>
      </div>
    );
  }
}
