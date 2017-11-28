import * as React from 'react';
import { VirtualTable, RowData } from '../../src/index';
import { generateData } from '../../test/dataUtils';
import { autobind } from 'core-decorators';

const Head = () => (
  <thead>
    <tr>
      <th>Col 1</th>
      <th>Col 2</th>
      <th>Col 3</th>
      <th>Col 4</th>
      <th>Col 5</th>
    </tr>
  </thead>
);

const Row = ({data}) => (
  <tr>
    <td>{data.col1}</td>
    <td>{data.col2}</td>
    <td>{data.col3.toString()}</td>
    <td>{data.col4.toLocaleString()}</td>
    <td style={{whiteSpace: 'nowrap'}}>{data.col5.toFixed(5)}</td>
  </tr>
);

export default class Style extends React.Component<{}, {
  rows: any[];
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      rows: generateData(500000)
    };
  }

  @autobind
  private getRows(index: number, length: number): RowData[] {
    return this.state.rows.slice(index, index + length).map((data, index) => {
      return {
        data
      };
    });
  }

  public render() {
    const { rows } = this.state;
    return (
      <VirtualTable
        getRows={this.getRows}
        rowCount={rows.length}
        height={486}
        header={Head}
        row={Row}
      />
    );
  }

}
