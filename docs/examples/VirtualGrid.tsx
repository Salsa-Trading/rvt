import * as React from 'react';
import * as _ from 'lodash';
import { VirtualGrid, Field, FieldSet, ListState, ListStateChangeType, isDataChange, RowData } from '../../src/index';
import { generateData } from '../../test/dataUtils';

import '../../scss/rvt_unicode.scss';

export default class VirtualGridExample extends React.Component<void, {
  originalData?: any[];
  data?: any[]
  listState?: ListState
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
      data: this.state.data[index + 2],
      rowProps: {
        style: {backgroundColor: index % 2 === 0 ? '' : 'lightgray'}
      }
    };
  }

  private onListStateChanged(listState: ListState, changeType: ListStateChangeType) {
    if(!isDataChange(changeType)) {
      return this.setState({listState});
    }

    let { data } = this.state;
    if(changeType === ListStateChangeType.filters) {
      data = this.state.originalData;
      for(let field of Object.keys(listState.filters)) {
        data = data.filter(d => (_.get(d, field).toString() || '').indexOf(listState.filters[field]) >= 0);
      }
    }

    if(listState.sorts && listState.sorts.length > 0) {
      data = _.orderBy(data, [listState.sorts[0].fieldName], [listState.sorts[0].direction]);
    }

    this.setState({listState, data});
  }

  public render() {
    const { listState } = this.state;
    return (
      <VirtualGrid
        getRow={this.getRow.bind(this)}
        rowCount={this.state.data.length - 2}
        listState={listState}
        onListStateChanged={this.onListStateChanged.bind(this)}
        className='table table-bordered table-condensed'
        fieldDefaults={{sortable: true, filterable: true}}
        autoResize={true}
        onMouseDown={(e, d, f) => console.log('mouse down', e, d, f)}
        onClick={(e, d, f) => console.log('click', e, d, f)}
        pinnedRows={this.state.data.slice(0, 2).map(d => ({data: d, rowProps: { style: { backgroundColor: 'red'}} }))}
      >
        <FieldSet header='Group 1' name='group1'>
          <Field header='Col 1' name='col1' sortDirection='asc' />
          <Field header='Col 2' name='col2' hidden />
        </FieldSet>
        <Field header='Col 3' name='col3' cell={d => <input type='checkbox' defaultChecked={d.col3} />} />
        <Field header='Col 4' name='col4' cell={(d) => d.col4.toString()} />
        <Field header='Col 5' name='col5' />
      </VirtualGrid>
    );
  }
}
