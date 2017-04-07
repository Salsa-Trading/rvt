import * as React from 'react';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

type VirtualGridProps = {
  getRow: (rowIndex: number) => RowData;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
};

class VirtualGrid extends React.Component<VirtualTableBaseProps & ListViewProps & VirtualGridProps, {}> {

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
      ...rest
    } = this.props;

    const header =
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
      />;

    const fields = fieldSet.getFields();
    const row =
      <GridRow
        fields={fields}
        onMouseDown={onMouseDown}
        onClick={onClick}
      />;

    return (
      <VirtualTable
        {...rest}
        header={header}
        row={row}
      />
    );
  }
}

export default List(VirtualGrid) as React.ComponentClass<VirtualTableBaseProps & ListProps & VirtualGridProps>;
