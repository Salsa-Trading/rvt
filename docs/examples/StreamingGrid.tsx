import * as React from 'react';
import * as _ from 'lodash';
import { VirtualGrid, Field, FieldSet, FieldProps, ListState, ListStateChangeType, isDataChange, GridRowProps } from '../../src/index';
import { generateData, SampleData, generateDataForSlice } from '../../test/dataUtils';
import { autobind } from 'core-decorators';

import '../../scss/rvt_unicode.scss';

function CustomCell({label, data, field}: {label: string, data?: any, field?: FieldProps }) {
  return (
    <div>
      <span style={{marginRight: 5}}>{label}</span>
      <span>{data.col5}</span>
    </div>
  );
}

const whiteRowProps = {
  style: {}
};

const grayRowProps = {
  style: {backgroundColor: 'lightgray'}
};

export default class VirtualGridExample extends React.Component<{}, {
  rows?: any[]
  listState?: ListState
}> {
  private interval: number;

  constructor(props, context) {
    super(props, context);
    const rows = generateData(10);
    this.state = {
      rows
    };
  }

  public componentDidMount() {
    this.interval = window.setInterval(this.addRow, 3000);
  }

  public componentWillUnmount() {
    if(this.interval) {
      window.clearInterval(this.interval);
      this.interval = null
    }
  }

  @autobind
  private addRow() {
    const {rows} = this.state;

    this.setState({
      rows: [
        ...rows,
        ...generateDataForSlice(rows.length, 5)
      ]
    });
  }

  @autobind
  public getRows(index: number, length: number): {data: SampleData, rowProps?: React.HTMLProps<HTMLTableRowElement>}[] {
    return this.state.rows.slice(index, index + length).map((data, index) => {
      return {
        data,
        rowProps: data.col1 % 2 === 0 ? grayRowProps : whiteRowProps,
        key: data.col2
      };
    });
  } 

  private onListStateChanged(listState: ListState, changeType: ListStateChangeType) {
    if(!isDataChange(changeType)) {
      return this.setState({listState});
    }

    this.setState({listState});
  }

  public render() {
    const { listState } = this.state;
    return (
      <VirtualGrid
        getRows={this.getRows}
        rowCount={this.state.rows.length}
        listState={listState}
        onListStateChanged={this.onListStateChanged.bind(this)}
        className='table table-bordered table-condensed'
        fieldDefaults={{sortable: true, filterable: true}}
        autoResize={true}
        onMouseDown={(e, d, f) => console.log('mouse down', e, d, f)}
        onClick={(e, d, f) => console.log('click', e, d, f)}
      >
        <FieldSet header='Group 1' name='group1'>
          <FieldSet header='Group 2' name='group2'>
            <Field header='Col 1' name='col1' sortDirection='asc' />
            <Field header='Col 2' name='col2' />
          </FieldSet>
        </FieldSet>
        <FieldSet header='Group 3' name='group3'>
          <Field header='Col 3' name='col3' cell={({data}) => <input type='checkbox' defaultChecked={data.col3} />} />
          <Field header='Col 4' name='col4' format={d => d.col4.toString()} />
          <Field header='Col 5' name='col5' cell={<CustomCell label='test' />} />
        </FieldSet>
      </VirtualGrid>
    );
  }
}
