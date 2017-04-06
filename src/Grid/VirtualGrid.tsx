import * as React from 'react';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';

export type RowData = {
  data: any;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

class VirtualGrid extends React.Component<VirtualTableBaseProps & ListViewProps & {
  getRow: (rowIndex: number) => RowData;
}, {}> {

  public render() {
    const { fieldSet, onSortSelection, onFilterChanged, onWidthChanged, onMove, onHiddenChange, ...rest } = this.props;

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
    const row = <GridRow fields={fields} />;

    return (
      <VirtualTable
        {...rest}
        header={header}
        row={row}
      />
    );
  }
}

export default List(VirtualGrid) as React.ComponentClass<VirtualTableBaseProps & ListProps & {
  getRow: (rowIndex: number) => RowData;
}>;
