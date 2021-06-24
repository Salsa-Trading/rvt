import * as React from 'react';
import {GridRowProps, BaseGridProps, DynamicRowComponentProps} from './types';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';
import { isEqual } from 'lodash';
import {autobind} from 'core-decorators';

export type VirtualGridProps<TData extends object> = BaseGridProps<TData> & {
  getRows?: (rowIndex: number, length: number) => GridRowProps<TData>[];
  getRow?: (rowIndex: number) => GridRowProps<TData>;
};

export type WrappedVirtualGridProps<TData extends object> = VirtualTableBaseProps & ListViewProps & VirtualGridProps<TData>;

export class VirtualGrid<TData extends object> extends React.Component<WrappedVirtualGridProps<TData>, {
  rowComponent: React.ComponentType<DynamicRowComponentProps<TData>>;
  allWidthsSet: boolean;
}> {

  constructor(props: WrappedVirtualGridProps<TData>, context) {
    super(props, context);
    this.state = {
      rowComponent: this.generateRowComponent(props),
      allWidthsSet: false
    };
  }

  public UNSAFE_componentWillReceiveProps(nextProps: WrappedVirtualGridProps<TData>) {
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

  private generateRowComponent(props: WrappedVirtualGridProps<TData>): React.ComponentType<DynamicRowComponentProps<TData>> {
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
    return class VirtualGridRow extends React.Component<DynamicRowComponentProps<TData>> {
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
    }
  }

  @autobind
  private onAllHeaderWidthsSet() {
    if (!this.state.allWidthsSet) {
      this.setState({ allWidthsSet: true });
    }
  }

  public render() {
    const {
      children,
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
      rowComponent,
      rowHeaderComponent,
      secondaryHeaderComponent,
      chooserMountPoint,
      hideDefaultChooser,
      hideFilters,
      hideHeader,
      ...rest
    } = this.props;

    const {rowComponent: RowComponent, allWidthsSet} = this.state;
    const fixedColumnWidth = this.props.fixedColumnWidth ? allWidthsSet : false;
    const header = (
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onTitleChanged={onTitleChanged}
        onAllHeaderWidthsSet={this.onAllHeaderWidthsSet}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
        pinnedRows={pinnedRows}
        secondaryHeader={secondaryHeaderComponent}
        rowHeader={rowHeaderComponent}
        gridRow={RowComponent}
        chooserMountPoint={chooserMountPoint}
        hideDefaultChooser={hideDefaultChooser}
        fixedColumnWidth={fixedColumnWidth}
        hideFilters={hideFilters}
        hideHeader={hideHeader}
      />
    );

    return (
      <VirtualTable
        {...rest}
        header={header}
        fixedColumnWidth={fixedColumnWidth}
        row={RowComponent}
      />
    );
  }
}

export default class WrappedVirtualGrid<TData extends object> extends React.Component<
  VirtualTableBaseProps & ListProps & VirtualGridProps<TData>
, {}> {
  private Component = List(VirtualGrid);
  public render(): React.ReactElement<any> {
    const {Component} = this;
    return (
      <Component {...this.props}/>
    );
  }
}
