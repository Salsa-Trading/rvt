import * as React from 'react';
import * as _ from 'lodash';
import { CustomGrid, Field, FieldSet, ListState, ListStateChangeType, isDataChange, RowData } from '../../src/index';
import { generateData } from '../../test/dataUtils';

import '../../src/styles/grid.scss';

class Body extends React.Component<{
  data: any[]
  fields?: any;
}, {}> {

  public render() {
    const { data, fields} = this.props;
    return <tbody>
      {data.map((d, i) => <tr key={i}>
        {fields.map((f, c) => <td key={c}>
          {_.get(d, f.field).toString()}
        </td>
        )}
        </tr>
      )}
    </tbody>;
  }

}

export default class VirtualGridExample extends React.Component<{
}, {
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
      data: this.state.data[index],
      rowProps: {
        style: {backgroundColor: index % 2 === 0 ? '' : 'lightgray'}
      }
    };
  };

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
      data = _.orderBy(data, [listState.sorts[0].field], [listState.sorts[0].direction]);
    }

    this.setState({listState, data});
  }

  public render() {
    const { listState, data } = this.state;
    return (
      <CustomGrid
        listState={listState}
        onListStateChanged={this.onListStateChanged.bind(this)}
        fieldDefaults={{sortable: true, filterable: true}}
        className='table table-bordered table-condensed'
        data={data}
        body={Body}
      >
        <FieldSet header='Group 1' field='group1'>
          <Field header='Col 1' field='col1' sortable />
          <FieldSet header='Sub Group 1' field='subGroup1'>
            <Field header='Col 2' field='col2' filterable sortable sortDirection='desc' />
            <Field header='Col 3' field='col3' cell={d => <input type='checkbox' defaultChecked={d.col3} />} />
          </FieldSet>
        </FieldSet>
        <FieldSet header='Group 2' field='group2'>
          <FieldSet header='Sub Group 2' field='subGroup2'>
            <Field header='Col 4' field='col4' cell={(d) => d.col4.toString()} />
          </FieldSet>
          <Field header='Col 5' field='col5' />
        </FieldSet>
      </CustomGrid>
    );
  }
}
