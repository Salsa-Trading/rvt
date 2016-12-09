import * as React from 'react';
import SortIndicator from './SortIndicator';
import Column, { ColumnProps } from './Column';

export default class GridHeaderCell extends React.Component<{
  onSortSelection: () => void;
  column: ColumnProps
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func,
    column: Column.propTypes
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
                onSortSelection={d => onSortSelection ? onSortSelection(d, this.props.column) : null}
              />
            }
          </div>
        </div>
      </th>
    );
  }
}
