import * as React from 'react';
import { ColumnProps } from './Column';
import SortDirection from './SortDirection';

export default class Filter extends React.Component<{
  column: ColumnProps
  onSortSelection?: any;
  onFilterChanged: (filter: any) => void;
}, {
  showFilter: boolean;
  filter: any;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      filter: props.filter,
      showFilter: false
    };
  }

  private handleFilterChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({filter: e.target.value});
  }

  private toggleFilterPane() {
    this.setState({showFilter: !this.state.showFilter });
  }

  private handleOk() {
    const { onFilterChanged } = this.props;
    const { filter } = this.state;
    onFilterChanged(filter);
    this.setState({showFilter: false});
  }

  private handleCancel() {
    this.setState({showFilter: false});
  }

  private renderFilterPane() {
    const { onSortSelection } = this.props;
    const { filter } = this.state;
    return (
      <div className='filterPane'>
        <div>
          <button type='button' onClick={() => onSortSelection(SortDirection.ASCENDING)}>Ascending</button>
          <button type='button' onClick={() => onSortSelection(SortDirection.DESCENDING)}>Descending</button>
        </div>
        <div>
          <input type='text' value={filter} onChange={this.handleFilterChanged.bind(this)} />
        </div>
        <div>
          <button type='button' onClick={this.handleCancel.bind(this)}>Cancel</button>
          <button type='button' onClick={this.handleOk.bind(this)}>Ok</button>
        </div>
      </div>
    );
  }

  public render() {
    const { showFilter } = this.state;
    return (
      <div>
        <button type='button' className='filterButton' onClick={this.toggleFilterPane.bind(this)}>F</button>
        {showFilter && this.renderFilterPane()}
      </div>
    );
  }
}
