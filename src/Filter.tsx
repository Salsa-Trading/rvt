import * as React from 'react';
import { autobind } from 'core-decorators';
import { Field, SortDirection } from './List/Field';
import safeMouseDown from './utils/safeMouseDown';

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
        className='form-control'
        placeholder='Filter'
        value={filter}
        onChange={this.handleFilterChanged}
        autoFocus={true}
      />
    );
  }
}

export type FilterProps = {
  field: Field
  onSortSelection?: (sortDirection: SortDirection) => void;
  onFilterChanged: (filter: any) => void;
};

export default class Filter extends React.Component<FilterProps, {
  showFilter: boolean;
  filter: any;
}> {

  private mouseDownHandler: () => void;

  constructor(props: FilterProps, context) {
    super(props, context);

    this.state = {
      showFilter: false,
      filter: props.field.filter || ''
    };
  }

  public componentDidMount() {
    this.mouseDownHandler = safeMouseDown<HTMLElement>((e) => {
      if(!(e as any).target.closest('.filter-pane')) {
        this.setState({showFilter: false});
      }
    });
  }

  public componentWillUnmount() {
    if(this.mouseDownHandler) {
      this.mouseDownHandler();
    }
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

  @autobind
  private sortAscFn() {
    const {field, onSortSelection} = this.props;
    if(field.sortDirection === SortDirection.asc) {
      onSortSelection(null);
    } else {
      onSortSelection(SortDirection.asc);
    }
  }

  @autobind
  private sortDescFn() {
    const {field, onSortSelection} = this.props;
    if(field.sortDirection === SortDirection.desc) {
      onSortSelection(null);
    } else {
      onSortSelection(SortDirection.desc);
    }
  }

  private renderFilterPane() {
    const { field, onSortSelection } = this.props;
    const { sortDirection } = field;

    const { filter } = this.state;

    const filterElement = React.createElement((field.filterControl || DefaultFilter as any), {
      filter,
      onFilterChange: this.handleFilterChanged.bind(this)
    });

    const sortElement = field.sortable ? (
      <div className='form-group'>
        <div className='btn-group sort-controls'>
          <button className='btn' onClick={this.sortAscFn}>
            {sortDirection === SortDirection.asc ? <span className='checked'/> : null}
            Ascending
          </button>
          <button className='btn' onClick={this.sortDescFn}>
            {sortDirection === SortDirection.desc ? <span className='checked'/> : null}
            Descending
          </button>
        </div>
      </div>
    ) : null;

    return (
      <div className='card filter-pane'>
        {sortElement}
        <form onSubmit={this.handleOk}>
          <div className='form-group'>
            {filterElement}
          </div>
          <div className='form-group'>
            <div className='form-actions'>
              <button className='btn btn-secondary' type='reset' onClick={this.handleCancel}>Cancel</button>
              <button className='btn btn-primary' type='submit'>Ok</button>
            </div>
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
