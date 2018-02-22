import * as React from 'react';
import GridHeader from './GridHeader';
import { VirtualGridMouseEventHandler, GridRowProps, BaseGridProps } from './types';
import GridRow from './GridRow';
import List, { ListProps, ListViewProps } from '../List';

export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export type TablePropsWithoutData = Omit<React.HTMLProps<HTMLTableElement>, 'data' | 'onClick' | 'onDoubleClick' | 'onMouseDown'>;

export type GridProps<TData extends object> = TablePropsWithoutData & BaseGridProps<TData> & {
  data: GridRowProps<TData>[];
};

class Grid<TData extends object> extends React.Component<GridProps<TData> & ListViewProps, {}> {

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
      data,
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
      <div className='rvt'>
        <table {...rest}>
          {header}
          <tbody>
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
