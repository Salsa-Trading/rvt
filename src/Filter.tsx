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
          <button type='button' onClick={() => onSortSelection('asc')}>Ascending</button>
          <button type='button' onClick={() => onSortSelection('desc')}>Descending</button>
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

  private onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  public render() {
    const { showFilter } = this.state;
    let sortArrow;
    if(this.props.column.sortDirection === 'asc') {
      sortArrow = <span className='fa fa-long-arrow-down' />;
    }
    else if(this.props.column.sortDirection === 'desc') {
      sortArrow = <span className='fa fa-long-arrow-up' />;
    }
    return (
      <div>
        <div>
          <span className='fa fa-filter' onClick={this.toggleFilterPane.bind(this)} onMouseDown={this.onMouseDown.bind(this)}/>
          {sortArrow}
        </div>
        {showFilter && this.renderFilterPane()}
      </div>
    );
  }
}
