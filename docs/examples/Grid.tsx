import * as React from 'react';
import * as _ from 'lodash';
import { Grid, Field, FieldSet, ListState, ListStateChangeType, isDataChange, GridRowProps, FieldProps } from '../../src/index';
import { generateData, SampleData } from '../../test/dataUtils';
import { autobind } from 'core-decorators';

import '../../scss/rvt_fa.scss';

function Cell({ data, field }: { data: any, field: FieldProps }) {
  return <span style={{color: 'red'}}>{data.col5}</span>;
}

function Header(props: any) {
  return <span>{props.field.name}</span>;
}

export default class GridExample extends React.Component<{}, {
  originalData?: any[];
  data?: any[]
  listState?: ListState
}> {

  constructor(props, context) {
    super(props, context);
    const originalData = generateData(50);
    this.state = {
      originalData,
      data: originalData
    };
  }

  @autobind
  public getRow(data: any, index: number): GridRowProps<SampleData> {
    return {
      data,
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
    const { listState, data } = this.state;
    const rows: GridRowProps<SampleData>[] = data.map(this.getRow);

    return (
      <Grid
        listState={listState}
        onListStateChanged={this.onListStateChanged.bind(this)}
        fieldDefaults={{sortable: true, filterable: true}}
        className='table table-bordered table-condensed'
        data={rows}
        onDoubleClick={() => console.log('Double click event')}
        fixedColumnWidth={true}
        hideFilters={true}
      >
        <FieldSet header='Group 1' name='group1'>
          <Field header={Header} name='col1' sortDirection='asc' />
          <Field header='Col 2' name='col2' hidden />
        </FieldSet>
        <Field header='Col 3' name='col3' cell={({data}) => <input type='checkbox' defaultChecked={data.col3} />} />
        <Field header='Col 4' name='col4' format={d => d.col4.toString()} />
        <Field header='Col 5' name='col5' cell={Cell} />
      </Grid>
    );
  }
}
