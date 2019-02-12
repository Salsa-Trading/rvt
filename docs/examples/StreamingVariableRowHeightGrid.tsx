import * as React from 'react';
import { CellProps } from '../../src/List/Field';
import {
  VirtualGrid,
  Field,
  FieldSet,
  FieldProps,
  ListState,
  ListStateChangeType,
  isDataChange
} from '../../src/index';
import {
  generateData,
  SampleData,
  generateDataForSlice
} from '../../test/dataUtils';
import { autobind } from 'core-decorators';

import '../../scss/rvt_unicode.scss';

function CustomCell({
  label,
  data,
  field
}: {
  label: string;
  data?: any;
  field?: FieldProps;
}) {
  return (
    <div>
      <span style={{ marginRight: 5 }}>{label}</span>
      <span>{data.col5}</span>
    </div>
  );
}

const whiteRowProps = {
  style: {}
};

const grayRowProps = {
  style: { backgroundColor: 'lightgray' }
};

export default class StreamingVariableRowHeightGrid extends React.Component<
  {
    variableRowHeight: boolean;
  },
  {
    rows?: any[];
    listState?: ListState;
    updateInterval: number;
    minimumRowHeight: number;
    dataAppendAmount: number;
    variableRowHeight: boolean;
  }
> {
  private interval: number;
  private checkBox: any;

  constructor(props, context) {
    super(props, context);
    const rows = generateData(10);
    this.state = {
      rows,
      updateInterval: 3000,
      minimumRowHeight: 20,
      dataAppendAmount: 5,
      variableRowHeight: props.variableRowHeight
    };
  }

  public componentDidMount() {
    this.interval = window.setInterval(this.addRow, this.state.updateInterval);
  }

  public componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }

  @autobind
  private addRow() {
    const { rows, dataAppendAmount } = this.state;

    this.setState({
      // rows: [...rows, ...generateDataForSlice(rows.length, dataAppendAmount)]
      rows: [...generateDataForSlice(rows.length, dataAppendAmount), ...rows]
    });
  }

  @autobind
  public getRows(
    index: number,
    length: number
  ): { data: SampleData; rowProps?: React.HTMLProps<HTMLTableRowElement> }[] {
    const { variableRowHeight, minimumRowHeight } = this.state;
    return this.state.rows.slice(index, index + length).map((data, i) => {
      const rowProps = data.col1 % 2 === 0 ? grayRowProps : whiteRowProps;
      let style = {
        ...rowProps.style
      };

      if (variableRowHeight) {
        const height: number =
          minimumRowHeight + Math.floor(60 * Math.sin((i + 1) / 100));
        style = {
          ...style,
          height
        };
      }

      return {
        data,
        rowProps: {
          ...rowProps,
          style: {
            ...style
          }
        },
        key: data.col2
      };
    });
  }

  @autobind
  private onListStateChanged(
    listState: ListState,
    changeType: ListStateChangeType
  ) {
    if (!isDataChange(changeType)) {
      return this.setState({ listState });
    }

    this.setState({ listState });
  }

  @autobind
  private onMouseDown(e: React.MouseEvent<any>, d: SampleData, f: string) {
    console.log('mouse down', e, d, f);
  }

  @autobind
  private onClick(e: React.MouseEvent<any>, d: SampleData, f: string) {
    console.log('click', e, d, f);
  }

  @autobind
  private col3Formatter(cellProps: CellProps): React.ReactElement<any> {
    const data: SampleData = cellProps.data;

    return <input type='checkbox' defaultChecked={data.col3} />;
  }

  @autobind
  private col4Formatter(data: SampleData): string {
    return data.col4.toString();
  }

  @autobind
  private updateInterval(e) {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
    const newInterval = parseInt(e.target.value, 10);
    this.interval = window.setInterval(this.addRow, newInterval);
    this.setState({ updateInterval:  newInterval});
  }

  @autobind
  private updateMinimumRowHeight(e) {
    const minimumRowHeight = parseInt(e.target.value, 10);
    this.setState({ minimumRowHeight});
  }


  @autobind
  private updateDataAppendAmount(e) {
    const dataAppendAmount = parseInt(e.target.value, 10);
    this.setState({ dataAppendAmount });
  }

  @autobind
  private changeVariableRowHeight() {
    this.setState({ variableRowHeight: this.checkBox.checked });
  }
  private col5Formatter: React.ReactElement<any> = <CustomCell label='test' />;

  public render() {
    const { listState, updateInterval, minimumRowHeight, variableRowHeight, dataAppendAmount } = this.state;

    return (
      <div style={{ height: '100%' }}>
        <div style={{ height: '100px' }}>
          <label htmlFor=''>Update Interval </label>
          <input
            type='number'
            title='Update interval'
            onChange={this.updateInterval}
            defaultValue={updateInterval.toString()}
            style={{ marginLeft: 5, marginRight: 5 }}
          />
           <label htmlFor=''>Minimum Row Height</label>
          <input
            type='number'
            title='Update minimum row height'
            onChange={this.updateMinimumRowHeight}
            defaultValue={minimumRowHeight.toString()}
            style={{ marginLeft: 5, marginRight: 5 }}
          />
          <label htmlFor=''>Data / Interval</label>
          <input
            type='number'
            title='Update data added per interval'
            onChange={this.updateDataAppendAmount}
            defaultValue={dataAppendAmount.toString()}
            style={{ marginLeft: 5, marginRight: 5 }}
          />
          <label htmlFor=''>Vary Row Height</label>
          <input
            type='checkBox'
            ref={ref => (this.checkBox = ref)}
            onClick={this.changeVariableRowHeight}
            style={{ marginLeft: 5 }}
            defaultChecked={variableRowHeight}
          />
        </div>
        <div style={{ height: 'calc(100% - 100px)' }}>
          <VirtualGrid
            getRows={this.getRows}
            rowCount={this.state.rows.length}
            listState={listState}
            onListStateChanged={this.onListStateChanged}
            className='table table-bordered table-condensed'
            fieldDefaults={{ sortable: true, filterable: true }}
            autoResize={true}
            onMouseDown={this.onMouseDown}
            onClick={this.onClick}
          >
            <FieldSet header='Group 1' name='group1'>
              <FieldSet header='Group 2' name='group2'>
                <Field header='Col 1' name='col1' sortDirection='asc' />
                <Field header='Col 2' name='col2' />
              </FieldSet>
            </FieldSet>
            <FieldSet header='Group 3' name='group3'>
              <Field header='Col 3' name='col3' cell={this.col3Formatter} />
              <Field header='Col 4' name='col4' format={this.col4Formatter} />
              <Field header='Col 5' name='col5' cell={this.col5Formatter} />
            </FieldSet>
          </VirtualGrid>
        </div>
      </div>
    );
  }
}
