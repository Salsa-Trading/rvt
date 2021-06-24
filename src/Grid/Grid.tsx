import * as React from 'react';
import GridHeader from './GridHeader';
import { GridRowProps, BaseGridProps, DynamicRowComponentProps } from './types';
import GridRow from './GridRow';
import List, { ListProps, ListViewProps } from '../List';
import { isEqual } from 'lodash';
import {autobind} from 'core-decorators';

export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type TablePropsWithoutData = Omit<React.HTMLProps<HTMLTableElement>, 'data' | 'onClick' | 'onDoubleClick' | 'onMouseDown' | 'style'>;

export type GridProps<TData extends object> = TablePropsWithoutData & BaseGridProps<TData> & {
  data: GridRowProps<TData>[];
};

export type WrappedGridProps<TData extends object> = GridProps<TData> & ListViewProps;

class Grid<TData extends object> extends React.Component<WrappedGridProps<TData>, {
  rowComponent: React.ComponentType<DynamicRowComponentProps<TData>>;
  allWidthsSet: boolean;
}> {

  constructor(props: WrappedGridProps<TData>, context) {
    super(props, context);
    this.state = {
      rowComponent: this.generateRowComponent(props),
      allWidthsSet: false
    };
  }

  public UNSAFE_componentWillReceiveProps(nextProps: WrappedGridProps<TData>) {
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

  private generateRowComponent(props: WrappedGridProps<TData>): React.ComponentClass<DynamicRowComponentProps<TData>> {
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
    const RowComponent = rowComponent || GridRow;
    return class GridRow extends React.Component<DynamicRowComponentProps<TData>> {
      public render() {
        return (
          <RowComponent
            {...this.props}
            fields={fields}
            onMouseDown={onMouseDown}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            rowHeaderComponent={rowHeaderComponent}
            fixedColumnWidth={fixedColumnWidth}
          />
        );
      }
    };
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
      hideFilters,
      ...rest
    } = this.props;

    const {rowComponent: RowComponent, allWidthsSet} = this.state;
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
        gridRow={RowComponent}
        rowHeader={rowHeaderComponent}
        secondaryHeader={secondaryHeaderComponent}
        chooserMountPoint={chooserMountPoint}
        hideDefaultChooser={hideDefaultChooser}
        fixedColumnWidth={setFixedColumnWidth}
        hideHeader={hideHeader}
        hideFilters={hideFilters}
      />
    );

    return (
      <div className={`rvt ${setFixedColumnWidth ? 'fixed-column-width' : ''}`}>
        <div className='rvt-table-container'>
          <table {...rest} style={tableStyle}>
            {header}
            <tbody style={tbodyStyle}>
              {data.map((d, i) => (
                <RowComponent {...d} key={d.key || String(i)}/>
              ))}
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
