import * as React from 'react';
import GridHeader from './GridHeader';
import { VirtualGridMouseEventHandler, GridRowProps, BaseGridProps } from './types';
import GridRow from './GridRow';
import List, { ListProps, ListViewProps } from '../List';
import { isEqual } from 'lodash';

export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
export type TablePropsWithoutData = Omit<React.HTMLProps<HTMLTableElement>, 'data' | 'onClick' | 'onDoubleClick' | 'onMouseDown'>;

export type GridProps<TData extends object> = TablePropsWithoutData & BaseGridProps<TData> & {
  data: GridRowProps<TData>[];
};

export type WrappedGridProps<TData extends object> = GridProps<TData> & ListViewProps;

class Grid<TData extends object> extends React.Component<WrappedGridProps<TData>, {
  rowComponent: React.ReactElement<any>;
}> {

  constructor(props: WrappedGridProps<TData>, context) {
    super(props, context);
    this.state = {
      rowComponent: this.generateRowComponent(props)
    }
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
      })
    }
  }

  private generateRowComponent(props: WrappedGridProps<TData>): React.ReactElement<any> {
    const {
      fieldSet,
      onMouseDown,
      onClick,
      onDoubleClick,
      rowComponent,
    } = this.props;

    const fields = fieldSet.getFields();
    return React.createElement(rowComponent || GridRow, {
      fields: fields,
      onMouseDown: onMouseDown,
      onClick: onClick,
      onDoubleClick: onDoubleClick
    });
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
      data,
      rowComponent,
      ...rest
    } = this.props;

    const {rowComponent: row} = this.state;

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
