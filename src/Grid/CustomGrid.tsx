import * as React from 'react';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';

class CustomGrid extends React.Component<React.HTMLProps<HTMLTableElement> & ListViewProps & {
  body: React.ComponentClass<any>|React.StatelessComponent<any>;
  data: any;
}, {}> {

  public render() {
    const { fieldSet, onSortSelection, onFilterChanged, onWidthChanged, onMove, body, data, ...rest } = this.props;

    const header =
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onMove={onMove}
      />;

    const fields = fieldSet.getFields();

    const bodyElement = React.createElement(body as any, {fields, data});

    return (
      <div className='rvt'>
        <table {...rest}>
          {header}
          {bodyElement}
        </table>
      </div>
    );
  }
}

export default List(CustomGrid) as React.ComponentClass<React.HTMLProps<HTMLTableElement> & ListProps & {
  body: React.ComponentClass<any>|React.StatelessComponent<any>;
  data: any;
}>;

