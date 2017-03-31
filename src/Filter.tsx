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

  private handleOk(e) {
    e.preventDefault();
    const { onFilterChanged } = this.props;
    const { filter } = this.state;
    onFilterChanged(filter);
    this.setState({showFilter: false});
  }

  private handleCancel(e) {
    e.preventDefault();
    this.setState({showFilter: false});
  }

  private renderFilterPane() {
    const { column, onSortSelection } = this.props;
    const { sortDirection } = column;

    const { filter } = this.state;
    const sortAscFn = () => onSortSelection(SortDirection.asc);
    const sortDescFn = () => onSortSelection(SortDirection.desc);
    return (
      <div className='filter-pane'>
        <div>
          <button onClick={sortAscFn}>
            {sortDirection === SortDirection.asc ? <span className='checked'/> : null}
            Ascending
          </button>
          <button onClick={sortDescFn}>
            {sortDirection === SortDirection.desc ? <span className='checked'/> : null}
            Descending
          </button>
        </div>
        <form onSubmit={this.handleOk.bind(this)}>
          <input
            type='search'
            value={filter}
            onChange={this.handleFilterChanged.bind(this)}
            autoFocus={true}
          />
          <div className='form-actions'>
            <button type='reset' onClick={this.handleCancel.bind(this)}>Cancel</button>
            <button type='submit'>Ok</button>
          </div>
        </form>
      </div>
    );
  }

  public render() {
    const { showFilter } = this.state;
    let sortArrow;
    if(this.props.column.sortDirection === SortDirection.asc) {
      sortArrow = <span className='sort-asc' />;
    }
    else if(this.props.column.sortDirection === SortDirection.desc) {
      sortArrow = <span className='sort-desc' />;
    }
    return (
      <div>
        <button className='filter-btn' onClick={this.toggleFilterPane.bind(this)}>
          <span className='edit-filters' />
          {sortArrow}
        </button>
        {showFilter && this.renderFilterPane()}
      </div>
    );
  }
}
