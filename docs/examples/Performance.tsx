import * as React from 'react';
import { Table } from '../../src/index';
import { generateData } from '../../test/dataUtils';

class Head extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <thead>
        <tr>
          <th>Col 1</th>
          <th>Col 2</th>
          <th>Col 3</th>
          <th>Col 4</th>
          <th>Col 5</th>
          <th>Col 6</th>
        </tr>
      </thead>
   );
  }
}

class Row extends React.Component<{
  data: any;
}, {}> {

  private col1Ref: any;
  private col2Ref: any;
  private col3Ref: any;
  private col4Ref: any;
  private col5Ref: any;
  private col6Ref: any;

  constructor(props, context) {
    super(props, context);
  }

  public shouldComponentUpdate(nextProps) {
    const lastData = this.props.data;
    const { data } = nextProps;
    this.col1Ref.innerText = data.col1;
    this.col2Ref.innerText = data.col2;
    this.col3Ref.innerText = data.col3.toString();
    this.col4Ref.innerText = data.col4.toLocaleString();
    this.col5Ref.innerText = data.col5.toFixed(5);
    if(data.col6 !== lastData.col6) {
      this.col6Ref.innerText = data.col6;
    }
    return false;
  }

  public render() {
    const { data } = this.props;
    return (
      <tr>
        <td ref={r => this.col1Ref = r}>{data.col1}</td>
        <td ref={r => this.col2Ref = r}>{data.col2}</td>
        <td ref={r => this.col3Ref = r}>{data.col3.toString()}</td>
        <td ref={r => this.col4Ref = r}>{data.col4.toLocaleString()}</td>
        <td ref={r => this.col5Ref = r}>{data.col5.toFixed(5)}</td>
        <td ref={r => this.col6Ref = r}>{data.col6}</td>
      </tr>
   );
  }
}

const rows = generateData(500000);

export default class Performance extends React.Component<{}, {
  rows: any[];
}> {

  private virtualTable: Table;

  constructor(props, context) {
    super(props, context);
    this.state = {
      rows
    };
  }

  private getRow(index) {
    return {
      data: this.state.rows[index]
    };
  }

  public render() {
    return (
      <div>
        <Table
          ref={r => this.virtualTable = r}
          getRow={this.getRow.bind(this)}
          rowCount={this.state.rows.length}
          header={Head}
          row={Row}
          className='table table-bordered wideTable' />
      </div>
    );
  }

}

