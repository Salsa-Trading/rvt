import * as React from 'react';
import * as _ from 'lodash';
import { VirtualGrid, Field, FieldSet, FieldProps, ListState, ListStateChangeType, isDataChange, GridRowProps } from '../../src/index';
import { generateData, SampleData } from '../../test/dataUtils';
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

function secondaryHeader({fields}: {fields: any[]}) {
  return (
    <tr>
      <th colSpan={fields.length} style={{textAlign: 'center', backgroundColor: 'lightblue'}}>
        SECONDARY HEADER
      </th>
    </tr>
  );
}

export default class VirtualGridExample extends React.Component<{}, {
  originalData?: any[];
  data?: SampleData[];
  listState?: ListState;
  pinnedRows: GridRowProps<SampleData>[];
}> {

  constructor(props, context) {
    super(props, context);
    const originalData = generateData(500);
    this.state = {
      originalData,
      data: originalData,
      pinnedRows: originalData.slice(0, 2).map(d => ({
        data: d,
        rowProps: {
          style: {
            backgroundColor: 'red'
          }
        }
      }))
    };
  }


  @autobind
  public getRows(index: number, length: number): {data: SampleData, rowProps?: React.HTMLProps<HTMLTableRowElement>}[] {
    return this.state.data.slice(index, index + length).map((data, index) => {
      return {
        data,
        rowProps: data.col1 % 2 === 0 ? grayRowProps : whiteRowProps,
        key: data.col2
      };
    });
  }

  @autobind
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

  @autobind
  private onMouseDown(e: React.MouseEvent<any>, d: SampleData, f: string) {
    console.log('mouse down', e, d, f);
  }

  @autobind
  private onClick(e: React.MouseEvent<any>, d: SampleData, f: string) {
    console.log('click', e, d, f);
  }

  public render() {
    const { listState, pinnedRows } = this.state;
    return (
      <VirtualGrid
        getRows={this.getRows}
        rowCount={this.state.data.length}
        listState={listState}
        onListStateChanged={this.onListStateChanged}
        className='table table-bordered table-condensed'
        fieldDefaults={{sortable: true, filterable: true}}
        autoResize={true}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        pinnedRows={pinnedRows}
        secondaryHeaderComponent={secondaryHeader}
        fixedColumnWidth={true}
        hideFilters={true}
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
