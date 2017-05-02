import * as React from 'react';
import { autobind } from 'core-decorators';
import { Field, SortDirection } from './List/Field';

export type FilterControlProps = {
  filter: any;
  onFilterChange: (filter: any) => void;
};

class DefaultFilter extends React.Component<FilterControlProps, {}> {

  @autobind
  private handleFilterChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { onFilterChange } = this.props;
    onFilterChange(e.target.value);
  }

  public render() {
    const { filter } = this.props;
    return (
      <input
        type='search'
        value={filter}
        onChange={this.handleFilterChanged}
        autoFocus={true}
      />
    );
  }
}

export default class Filter extends React.Component<{
  field: Field
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

  private handleFilterChanged(filter: any) {
    this.setState({filter});
  }

  @autobind
  private toggleFilterPane() {
    this.setState({showFilter: !this.state.showFilter });
  }

  @autobind
  private handleOk(e) {
    e.preventDefault();
    const { onFilterChanged } = this.props;
    const { filter } = this.state;
    onFilterChanged(filter);
    this.setState({showFilter: false});
  }

  @autobind
  private handleCancel(e) {
    e.preventDefault();
    this.setState({showFilter: false});
  }

  private renderFilterPane() {
    const { field, onSortSelection } = this.props;
    const { sortDirection } = field;

    const { filter } = this.state;
    const sortAscFn = () => onSortSelection(SortDirection.asc);
    const sortDescFn = () => onSortSelection(SortDirection.desc);

    const filterElement = React.createElement((field.filterControl || DefaultFilter as any), {
      filter,
      onFilterChange: this.handleFilterChanged.bind(this)
    });

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
        <form onSubmit={this.handleOk}>
          {filterElement}
          <div className='form-actions'>
            <button type='reset' onClick={this.handleCancel}>Cancel</button>
            <button type='submit'>Ok</button>
          </div>
        </form>
      </div>
    );
  }

  private sortDirectionIcon() {
    const { sortDirection } = this.props.field;

    if(sortDirection === SortDirection.asc) {
      return <span className='sort-asc' />;
    }
    else if(sortDirection === SortDirection.desc) {
      return <span className='sort-desc' />;
    }
  }

  public render() {
    const { showFilter } = this.state;
    return (
      <div>
        <button className='filter-btn' onClick={this.toggleFilterPane}>
          <span className='edit-filters' />
          {this.sortDirectionIcon()}
        </button>
        {showFilter && this.renderFilterPane()}
      </div>
    );
  }
}
