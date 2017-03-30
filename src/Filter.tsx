import * as React from 'react';
import { Column, SortDirection } from './Column';

export default class Filter extends React.Component<{
  column: Column
  onSortSelection?: (sortDirection: SortDirection) => void;
  onFilterChanged: (filter: any) => void;
}, {
  showFilter: boolean;
  filter: any;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showFilter: false,
      filter: props.filter || ''
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
      <div className='filter-pane'>
        <div>
          <button onClick={() => onSortSelection(SortDirection.asc)}>Ascending</button>
          <button onClick={() => onSortSelection(SortDirection.desc)}>Descending</button>
        </div>
        <div>
          <input type='text' value={filter} onChange={this.handleFilterChanged.bind(this)} />
        </div>
        <div>
          <button onClick={this.handleCancel.bind(this)}>Cancel</button>
          <button onClick={this.handleOk.bind(this)}>Ok</button>
        </div>
      </div>
    );
  }

  public render() {
    const { showFilter } = this.state;
    let sortArrow;
    if(this.props.column.sortDirection === SortDirection.asc) {
      sortArrow = <span className='fa fa-long-arrow-down' />;
    }
    else if(this.props.column.sortDirection === SortDirection.desc) {
      sortArrow = <span className='fa fa-long-arrow-up' />;
    }
    return (
      <div>
        <div>
          <button onClick={this.toggleFilterPane.bind(this)}>
            <span className='fa fa-filter' />
            {sortArrow}
          </button>
        </div>
        {showFilter && this.renderFilterPane()}
      </div>
    );
  }
}
