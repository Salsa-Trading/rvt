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
  {},
  {
    rows?: any[];
    listState?: ListState;
    updateInterval: number;
    variableRowHeight: boolean;
  }
> {
  private interval: number;
  private checkBox: any;
  private debouncedUpdateInterval: ()  => void;

  constructor(props, context) {
    super(props, context);
    const rows = generateData(10);
    this.state = {
      rows,
      updateInterval: 3000,
      variableRowHeight: false,
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
    const { rows } = this.state;

    this.setState({
      rows: [ ...rows, ...generateDataForSlice(rows.length, 5)]
    });
  }

  @autobind
  public getRows(
    index: number,
    length: number
  ): { data: SampleData; rowProps?: React.HTMLProps<HTMLTableRowElement> }[] {
      const {variableRowHeight} = this.state;
     return this.state.rows.slice(index, index + length).map((data, i) => {
      const rowProps = data.col1 % 2 === 0 ? grayRowProps : whiteRowProps;
      let style =  {
        ...rowProps.style,
      };

       if(variableRowHeight) {
        const height: number = 80 + Math.floor(60 * Math.sin((index + 1) / 100));
        style = {
          ...style,
          height
        }
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

    this.interval = window.setInterval(this.addRow, e.target.value);;
    this.setState({updateInterval: parseInt(e.target.value, 10)});
  }

  @autobind 
  private changeVariableRowHeight() {
    this.setState({variableRowHeight: this.checkBox.checked});
  }
  private col5Formatter: React.ReactElement<any> = <CustomCell label='test' />;

  public render() {
    const { listState, updateInterval } = this.state;

    return (
      <div>
        <label htmlFor="">Update Interval </label>
        <input type="number" title="Update interval" onChange={this.updateInterval} defaultValue={updateInterval.toString()} style={{marginLeft: 5}}/>
        <br/>
        <label htmlFor="">Vary Row Height</label>
        <input type="checkBox" ref={(ref) => this.checkBox = ref } onClick={this.changeVariableRowHeight} style={{marginLeft: 5}}/>
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
    );
  }
}
