import * as React from 'react';
import GridHeader from './GridHeader';
import { GridRowProps, BaseGridProps } from './types';
import GridRow from './GridRow';
import List, { ListProps, ListViewProps } from '../List';
import { isEqual } from 'lodash';
import {autobind} from 'core-decorators';

export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export type TablePropsWithoutData = Omit<React.HTMLProps<HTMLTableElement>, 'data' | 'onClick' | 'onDoubleClick' | 'onMouseDown' | 'style'>;

export type GridProps<TData extends object> = TablePropsWithoutData & BaseGridProps<TData> & {
  data: GridRowProps<TData>[];
  chooserMountPoint?: HTMLElement;
  hideDefaultChooser?: boolean;
  fixedColumnWidth?: boolean;
  hideHeader?: boolean;
};

export type WrappedGridProps<TData extends object> = GridProps<TData> & ListViewProps;

class Grid<TData extends object> extends React.Component<WrappedGridProps<TData>, {
  rowComponent: React.ReactElement<any>;
  allWidthsSet: boolean;
}> {

  constructor(props: WrappedGridProps<TData>, context) {
    super(props, context);
    this.state = {
      rowComponent: this.generateRowComponent(props),
      allWidthsSet: false
    };
  }

  public componentWillReceiveProps(nextProps: WrappedGridProps<TData>) {
    const currentRowComponentProps = {
      fieldSet: this.props.fieldSet,
      onMouseDown: this.props.onMouseDown,
      onClick: this.props.onClick,
      onDoubleClick: this.props.onDoubleClick,
      rowComponent: this.props.rowComponent
    };

    const nextRowComponentProps = {
      fieldSet: nextProps.fieldSet,
      onMouseDown: nextProps.onMouseDown,
      onClick: nextProps.onClick,
      onDoubleClick: nextProps.onDoubleClick,
      rowComponent: nextProps.rowComponent
    };

    if(!isEqual(currentRowComponentProps, nextRowComponentProps)) {
      this.setState({
        rowComponent: this.generateRowComponent(nextProps)
      });
    }
  }

  private generateRowComponent(props: WrappedGridProps<TData>): React.ReactElement<any> {
    const {
      fieldSet,
      onMouseDown,
      onClick,
      onDoubleClick,
      rowComponent,
      rowHeaderComponent,
      fixedColumnWidth
    } = props;

    const fields = fieldSet.getFields();
    return React.createElement(rowComponent || GridRow, {
      fields: fields,
      onMouseDown: onMouseDown,
      onClick: onClick,
      onDoubleClick: onDoubleClick,
      rowHeaderComponent,
      fixedColumnWidth
    });
  }

  @autobind
  private onAllHeaderWidthsSet() {
    if (!this.state.allWidthsSet) {
      this.setState({ allWidthsSet: true });
    }
  }

  public render() {
    const {
      fieldSet,
      onSortSelection,
      onFilterChanged,
      onWidthChanged,
      onTitleChanged,
      onMove,
      onHiddenChange,
      onMouseDown,
      onClick,
      onDoubleClick,
      pinnedRows,
      data,
      rowComponent,
      rowHeaderComponent,
      secondaryHeaderComponent,
      tableStyle,
      tbodyStyle,
      chooserMountPoint,
      hideDefaultChooser,
      fixedColumnWidth,
      hideHeader,
      ...rest
    } = this.props;

    const {rowComponent: row, allWidthsSet} = this.state;
    const setFixedColumnWidth = fixedColumnWidth ? allWidthsSet : false;

    const header = (
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onTitleChanged={onTitleChanged}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
        onAllHeaderWidthsSet={this.onAllHeaderWidthsSet}
        pinnedRows={pinnedRows}
        secondaryHeader={secondaryHeaderComponent}
        gridRow={row}
        rowHeader={rowHeaderComponent}
        chooserMountPoint={chooserMountPoint}
        hideDefaultChooser={hideDefaultChooser}
        fixedColumnWidth={setFixedColumnWidth}
        hideHeader={hideHeader}
      />
    );

    return (
      <div className={`rvt ${setFixedColumnWidth ? 'fixed-column-width' : ''}`}>
        <div className='rvt-table-container'>
          <table {...rest} style={tableStyle}>
            {header}
            <tbody style={tbodyStyle}>
              {data.map((d, i) => {
                return React.cloneElement(row, {
                  key: i,
                  data: d.data,
                  rowProps: d.rowProps
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default class WrappedGrid<TData extends object> extends React.Component<
  ListProps & GridProps<TData>
, {}> {
  private Component = List(Grid) as any;

  public render(): React.ReactElement<any> {
    const {Component} = this;

    return (
      <Component {...this.props}/>
    );
  }
}
