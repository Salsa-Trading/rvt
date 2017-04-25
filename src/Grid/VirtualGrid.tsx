import * as React from 'react';
import GridRow, { VirtualGridMouseEventHandler, RowData } from './GridRow';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';
import VirtualTable, { VirtualTableBaseProps } from '../VirtualTable';


type VirtualGridProps = {
  getRow: (rowIndex: number) => RowData;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  pinnedRows?: RowData[];
};

class VirtualGrid extends React.Component<VirtualTableBaseProps & ListViewProps & VirtualGridProps, {}> {

  private virtualTable: VirtualTable;

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
      pinnedRows,
      ...rest
    } = this.props;

    const fields = fieldSet.getFields();
    const row =
      <GridRow
        fields={fields}
        onMouseDown={onMouseDown}
        onClick={onClick}
      />;

    const header =
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
        pinnedRows={pinnedRows}
        gridRow={row}
      />;

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

export default List(VirtualGrid) as React.ComponentClass<VirtualTableBaseProps & ListProps & VirtualGridProps>;
