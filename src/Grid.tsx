import * as React from 'react';
import GridRow from './GridRow';
import GridHeader from './GridHeader';
import Table, {TableProps} from './Table';

export default class Grid extends React.Component<TableProps & {
  onSortSelection: () => void;
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

  private createColumns() {
    const columns = [];
    React.Children.forEach(this.props.children, (child: any) => {
      const col = new child.type.default(child.props);
      columns.push(col);
    });
    return columns;
  }

  public render() {
    const columns = this.createColumns();
    const { onSortSelection } = this.props;

    const header = <GridHeader columns={columns} onSortSelection={onSortSelection} />;
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

