import * as React from 'react';
import { VirtualTable } from '../../src/index';
import { generateData, SampleData } from '../../test/dataUtils';
import { autobind } from 'core-decorators';
import { TableRowProps } from '../../src/VirtualTable';

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

const Row = (rowProps: TableRowProps<SampleData>) => {
  const {data} = rowProps;

  return (
    <tr>
      <td>{data.col1}</td>
      <td>{data.col2}</td>
      <td>{data.col3.toString()}</td>
      <td>{data.col4.toLocaleString()}</td>
      <td style={{whiteSpace: 'nowrap'}}>{data.col5.toFixed(5)}</td>
    </tr>
  );
};

class Row2 extends React.Component<TableRowProps<SampleData>> {
  public render() {
    const {data} = this.props;

    return (
      <tr>
        <td>{data.col1}</td>
        <td>{data.col2}</td>
        <td>{data.col3.toString()}</td>
        <td>{data.col4.toLocaleString()}</td>
        <td style={{whiteSpace: 'nowrap'}}>{data.col5.toFixed(5)}</td>
      </tr>
    );
  }
}

class SampleVirtualTable extends VirtualTable<SampleData> { }

export default class Style extends React.Component<{}, {
  rows: SampleData[];
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      rows: generateData(500000)
    };
  }

  @autobind
  private getRows(index: number, length: number): TableRowProps<SampleData>[] {
    return this.state.rows.slice(index, index + length).map((data, index) => {
      return {data};
    });
  }

  public render() {
    const { rows } = this.state;

    return (
      <SampleVirtualTable
        getRows={this.getRows}
        rowCount={rows.length}
        height={486}
        header={Head}
        row={Row}
      />
    );
  }

}
