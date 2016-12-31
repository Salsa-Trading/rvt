import * as React from 'react';
import SortIndicator from './SortIndicator';

export default class GridHeaderCell extends React.Component<{
  onSortSelection: () => void;
  column: any
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func,
    column: React.PropTypes.any
  };

  public render() {
    const {
      column: {
        props: {
          name,
          width,
          sortDirection,
          canSort
        },
        header
      },
      onSortSelection
    } = this.props as any;

    const cellProps = Object.assign({}, header ? header.props : {}, {width});

    return (
      <th {...cellProps}>
        <div>
          <div style={{float: 'left'}}>
            {name}
          </div>
          <div style={{float: 'right'}}>
            {!canSort ? null :
              <SortIndicator
                sortDirection={sortDirection}
                onSortSelection={d => onSortSelection ? onSortSelection(d, this.props.column.props) : null}
              />
            }
          </div>
        </div>
      </th>
    );
  }
}
