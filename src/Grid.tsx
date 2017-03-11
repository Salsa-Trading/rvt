import * as React from 'react';
import { ColumnProps } from './Column';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import Table, { TableBaseProps } from './Table';

export default class Grid extends React.Component<TableBaseProps & {
  onSortSelection?: () => void;
  onWidthChanged?: (width: number, column: any) => void;
  onColumnMove?: (column: any, previousIndex: number, newIndex: number) => void;
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func
  };

  private table: Table;

  constructor(props, context) {
    super(props, context);
  }

  public calculateHeights() {
    this.table.calculateHeights();
  }

  private createColumns(): ColumnProps[] {
    return React.Children.map(this.props.children, (child: any) => {
      if (React.isValidElement(child)) {
        return child.props;
      }
      else {
        return child.props;
      }
    });
  }

  public render() {
    const columns = this.createColumns();
    columns.sort((a, b) => a.index - b.index);
    const { onSortSelection, onWidthChanged, onColumnMove } = this.props;

    const header = <GridHeader columns={columns} onSortSelection={onSortSelection} onWidthChanged={onWidthChanged} onMove={onColumnMove} />;
    const row = <GridRow columns={columns} />;

    return (
      <Table
        {...this.props}
        header={header}
        row={row}
        ref={r => this.table = r } />
    );
  }
}

