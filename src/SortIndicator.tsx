import * as React from 'react';
import SortDirection, {SortDirections} from './SortDirection';
import { Icon } from 'react-fa';

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

    let icon, nextDirection;
    if(sortDirection === SortDirection.ASCENDING) {
      icon = 'sort-asc';
      nextDirection = SortDirection.DESCENDING;
    }
    else if(sortDirection === SortDirection.DESCENDING) {
      icon = 'sort-desc';
      nextDirection = SortDirection.NONE;
    }
    else {
      icon = 'sort';
      nextDirection = SortDirection.ASCENDING;
    }

    return (
      <button onClick={() => onSortSelection && onSortSelection(nextDirection)}>
        <Icon name={icon} />
      </button>
    );
  }
}
