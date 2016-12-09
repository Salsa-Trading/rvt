import * as React from 'react';
import SortDirection, {SortDirections} from './SortDirection';

export default class SortIndicator extends React.Component<{
  sortDirection?: SortDirections,
  onSortSelection?: any;
}, {}> {

  public static propTypes = {
    /**
      * The current sortDirection
      */
    sortDirection: React.PropTypes.oneOf([SortDirection.ASCENDING, SortDirection.DESCENDING, SortDirection.NONE]),
    /**
      * Callback when the sortDirection is clicked
      */
    onSortSelection: React.PropTypes.func
  };

  public static defaultProps = {
    sortDirection: SortDirection.NONE
  };

  public render() {
    const { sortDirection, onSortSelection } = this.props;

    return (
      <div className='sortIndicator'>
        <button
          className={`ascending ${sortDirection === SortDirection.ASCENDING ? 'selected' : ''}`}
          onClick={() => onSortSelection ? onSortSelection(SortDirection.ASCENDING) : null}
        >
          <span>{'\u25be'}</span>
        </button>
        <button
          className={`descending ${sortDirection === SortDirection.DESCENDING ? 'selected' : ''}`}
          onClick={() => onSortSelection ? onSortSelection(SortDirection.DESCENDING) : null }
        >
          <span>{'\u25be'}</span>
        </button>
      </div>
    );
  }
}
