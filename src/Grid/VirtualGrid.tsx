import * as React from 'react';
import GridRow, { VirtualGridMouseEventHandler, GridRowProps } from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';


export type VirtualGridProps<TData> = {
  getRows?: (rowIndex: number, length: number) => GridRowProps<TData>[];
  getRow?: (rowIndex: number) => GridRowProps<TData>;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  pinnedRows?: GridRowProps<TData>[];
};

export class VirtualGrid<TData extends object> extends React.Component<VirtualTableBaseProps & ListViewProps & VirtualGridProps<TData>, {}> {

  private virtualTable: VirtualTable<TData>;

  public calculateHeights() {
    if(this.virtualTable) {
      this.virtualTable.calculateHeights();
    }
  }

  public render() {
    const {
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
      ...rest
    } = this.props;

    const fields = fieldSet.getFields();
    const row = (
      <GridRow
        fields={fields}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    );

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

    const setRef = (ref) => this.virtualTable = ref;
    return (
      <VirtualTable
        {...rest}
        header={header}
        row={row}
        ref={setRef}
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
