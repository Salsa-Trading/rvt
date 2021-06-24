import * as React from 'react';
import GridHeader from './GridHeader';
import List, { ListProps, ListViewProps } from '../List';

class CustomGrid extends React.Component<React.HTMLProps<HTMLTableElement> & ListViewProps & {
  body: React.ComponentClass<any>|React.FunctionComponent<any>;
  data: any;
}, {}> {

  public render() {
    const {
      fieldSet,
      onSortSelection,
      onFilterChanged,
      onWidthChanged,
      onHiddenChange,
      onMove,
      body: Body,
      data,
      ...rest
    } = this.props;

    const header = (
      <GridHeader
        fieldSet={fieldSet}
        onSortSelection={onSortSelection}
        onFilterChanged={onFilterChanged}
        onWidthChanged={onWidthChanged}
        onHiddenChange={onHiddenChange}
        onMove={onMove}
      />
    );

    const fields = fieldSet.getFields();

    return (
      <div className='rvt'>
        <table {...rest}>
          {header}
          <Body fields={fields} data={data}/>
        </table>
      </div>
    );
  }
}

export default List(CustomGrid) as React.ComponentClass<React.HTMLProps<HTMLTableElement> & ListProps & {
  body: React.ComponentClass<any>|React.FunctionComponent<any>;
  data: any;
}>;

