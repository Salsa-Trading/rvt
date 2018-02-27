import * as React from 'react';
import { VirtualGridMouseEventHandler, GridRowProps, BaseGridProps } from './types';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';

export type VirtualGridProps<TData extends object> = BaseGridProps<TData> & {
  getRows?: (rowIndex: number, length: number) => GridRowProps<TData>[];
  getRow?: (rowIndex: number) => GridRowProps<TData>;
};

export class VirtualGrid<TData extends object> extends React.Component<VirtualTableBaseProps & ListViewProps & VirtualGridProps<TData>, {}> {

  public render() {
    const {
      children,
      fieldSet,
      onSortSelection,
      onFilterChanged,
      onWidthChanged,
      onMove,
      onHiddenChange,
      onMouseDown,
      onClick,
      onDoubleClick,
      pinnedRows,
      rowComponent,
      ...rest
    } = this.props;

    const fields = fieldSet.getFields();
    const row: any = React.createElement(rowComponent || GridRow, {
      fields: fields,
      onMouseDown: onMouseDown,
      onClick: onClick,
      onDoubleClick: onDoubleClick
    });

    const header = (
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
        pinnedRows={pinnedRows}
        gridRow={row}
      />
    );

    return (
      <VirtualTable
        {...rest}
        header={header}
        row={row}
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
