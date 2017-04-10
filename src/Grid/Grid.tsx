import * as React from 'react';
import GridHeader from './GridHeader';
import GridRow, { VirtualGridMouseEventHandler, RowData } from './GridRow';
import List, { ListProps, ListViewProps } from '../List';

class Grid extends React.Component<React.HTMLProps<HTMLTableElement> & ListViewProps & {
  data: RowData[];
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  pinnedRows?: RowData[];
}, {}> {

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
      data,
      ...rest
    } = this.props;

    const fields = fieldSet.getFields();

    const header =
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMove={onMove}
        onHiddenChange={onHiddenChange}
        pinnedRows={pinnedRows}
        gridRow={<GridRow fields={fields} onMouseDown={onMouseDown} onClick={onClick} />}
      />;

    return (
      <div className='rvt'>
        <table {...rest}>
          {header}
          <tbody>
            {data.map((d, i) => <GridRow key={i} fields={fields} data={d.data} rowProps={d.rowProps} onMouseDown={onMouseDown} onClick={onClick} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default List(Grid) as React.ComponentClass<React.HTMLProps<HTMLTableElement> & ListProps & {
  data: any;
}>;

