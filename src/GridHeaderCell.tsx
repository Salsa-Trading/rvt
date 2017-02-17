import * as React from 'react';
import SortIndicator from './SortIndicator';

export default class GridHeaderCell extends React.Component<{
  onSortSelection: () => void;
  onWidthChanged: (width: number, column: any) => void;
  column: any
}, {}> {

  public static propTypes = {
    onSortSelection: React.PropTypes.func,
    onWidthChanged: React.PropTypes.func,
    column: React.PropTypes.any
  };

  private header: HTMLTableHeaderCellElement;

  private onMouseDown(e: React.MouseEvent<{}>) {
    console.log(this.props.column.width, this.header.clientWidth);
    if(e.button !== 0) {
      return;
    }
    const { onWidthChanged } = this.props;

    if(!onWidthChanged) {
      return;
    }
    const startingWidth = this.props.column.width || this.header.clientWidth;
    let startingX = e.pageX;

    const onMouseMove = (moveEvent: React.MouseEvent<{}>) => {
      onWidthChanged(startingWidth + (moveEvent.pageX - startingX), this.props.column.props);
      moveEvent.preventDefault();
    };

    const onMouseUp = (upEvent: React.MouseEvent<{}>) => {
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp as any);
      upEvent.preventDefault();
    };

    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp as any);
    e.preventDefault();
  }

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

    const cellProps = Object.assign({}, header ? header.props : {});
    const ref = (r) => this.header = r;

    return (
      <th {...cellProps} style={{width, padding: 0}} ref={ref}>
        <div className='gridHeaderCell'>
          <div className='name'>
            {name}
          </div>
          {!canSort ? null :
            <div className='sortIndicator'>
              <SortIndicator
                sortDirection={sortDirection}
                onSortSelection={d => onSortSelection ? onSortSelection(d, this.props.column.props) : null}
              />
            </div>
          }
          <div
            className='dragHandle'
            onMouseDown={this.onMouseDown.bind(this)}
          />
        </div>
      </th>
    );
  }
}
