import * as React from 'react';
import strEnum from '../utils/strEnum';

export const SortDirection = strEnum([
  'asc',
  'desc'
]);
export type SortDirection = keyof typeof SortDirection;

export const RootColumnGroup = '_root_';

export type ColumnDefaults = {
  sortable?: boolean;
  filterable?: boolean;
};

export interface ColumnDisplay {
  field: string;
  width?: number|string;
  hidden?: boolean;
  children?: ColumnDisplay[];
}

export interface ColumnProps extends React.Props<ColumnProps> {
  field: string;
  cell?: (data: any) => JSX.Element;
  header?: JSX.Element|string;
  filterControl?: JSX.Element|string;
  width?: number|string;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: SortDirection;
  filter?: any;
  hidden?: boolean;
};

export class Column implements ColumnProps {

  public field: string;
  public cell?: (data: any) => JSX.Element;
  public header?: JSX.Element|string;
  public filterControl?: JSX.Element|string;
  public width?: number|string;
  public sortable?: boolean;
  public filterable?: boolean;
  public sortDirection?: SortDirection;
  public filter?: any;
  public hidden?: boolean;

  constructor(props: ColumnProps) {
    Object.assign(this, props);
  }

  public getColumns(): Column[] {
    if(this.hidden) {
      return [];
    }
    return [this];
  }

  public getColumnDisplay(): ColumnDisplay {
    return {
      field: this.field,
      width: this.width,
      hidden: this.hidden
    };
  }

  public getCount() {
    return 1;
  }

  public resize(width: number) {
    this.width = width;
  }

}

export class ColumnDefinition extends React.Component<ColumnProps, {}> {

  public static propTypes = {
    field: React.PropTypes.string,
    header: React.PropTypes.any,
    cell: React.PropTypes.any,
    width: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    sortable: React.PropTypes.bool,
    filterable: React.PropTypes.bool,
    sortDirection: React.PropTypes.string,
    filter: React.PropTypes.any,
    hidden: React.PropTypes.bool
  };

  public static defaultProps = {
    sortable: false,
    filterable: false
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

export interface ColumnGroupProps extends React.Props<ColumnGroupProps> {
  field?: string;
  header?: JSX.Element|string;
  hidden?: boolean;
}

export class ColumnGroup {

  public field: string;
  public header: JSX.Element|string;
  public hidden?: boolean;
  public width?: number|string;
  public children: (Column|ColumnGroup)[];

  constructor(props: ColumnProps, columnDefaults: ColumnDefaults, fields: ColumnDisplay) {
    this.field = props.field;
    this.header = props.header;
    this.hidden = (fields && fields.hidden) || props.hidden;
    this.width = (fields && fields.width) || props.width;

    const children = React.Children.map(props.children, (c: any) => {
      let colDisplay = null;
      if(fields) {
        colDisplay = fields.children.find(cd => cd.field === c.props.field);
      }
      if(c.type.name === 'ColumnGroupDefinition') {
        return new ColumnGroup(c.props, columnDefaults, colDisplay);
      }
      if(c.type.name === 'ColumnDefinition') {
        return new Column({...columnDefaults, ...c.props, ...colDisplay});
      }
    });
    if(!fields || !fields.children || fields.children.length === 0) {
      fields = {
        field: this.field,
        hidden: false,
        children: children.map(c => ({field: c.field, hidden: false}))
      };
    }
    this.children = fields.children.map(cd => children.find(c => cd.field === c.field));
  }

  public getColumns(): Column[] {
    if(this.hidden) {
      return [];
    }
    let columns: Column[] = [];
    for(let column of this.children ) {
      columns = columns.concat(column.getColumns());
    }
    return columns;
  }

  public moveColumn(newIndex: number, column: Column) {
    const oldIndex = this.children.indexOf(column);
    if(oldIndex >= 0) {
      this.children.splice(newIndex, 0, this.children.splice(oldIndex, 1)[0]);
      return true;
    }
    else {
      for(let child of this.children) {
        if(child instanceof ColumnGroup) {
          let moved = child.moveColumn(newIndex, column);
          if(moved) {
            return moved;
          }
        }
      }
    }
    return false;
  }

  public findColumnGroupByField(field: string) {
    if(field === RootColumnGroup) {
      return this;
    }
    for(let child of this.children) {
      if(child instanceof ColumnGroup) {
        if(child.field === field) {
          return child;
        }
        let found = child.findColumnGroupByField(field);
        if(found) {
          return found;
        }
      }
    }
    return null;
  }

  public findColumnGroup(column: Column|ColumnGroup) {
    if(this.findColumnIndex(column) >= 0) {
      return this;
    }
    for(let child of this.children) {
      if(child instanceof ColumnGroup) {
        let found = child.findColumnGroup(column);
        if(found) {
          return found;
        }
      }
    }
    return null;
  }

  public findColumnIndex(column: Column|ColumnGroup) {
    return this.children.findIndex(c => c === column);
  }

  public getColumnIndex(index: number) {
    return this.children[index];
  }

  public getColumnDisplay(): ColumnDisplay {
    return {
      field: this.field,
      width: this.width,
      hidden: this.hidden,
      children: this.children.map(c => c.getColumnDisplay())
    };
  }

  public getLevelCount(): number {
    let levels = 0;
    for(let child of this.children) {
      if(child instanceof ColumnGroup) {
        levels = Math.max(levels, child.getLevelCount());
      }
    }
    return levels + 1;
  }

  public getLevels() {
    let levels = [];
    for(let child of this.children) {
      if(child instanceof ColumnGroup) {
        let subLevels = child.getLevels();
        for(let i = 0; i < subLevels.length; i++) {
          levels[i] = (levels[i] || []).concat(subLevels[i]);
        }
      }
    }
    const retVal = [this.children, ...levels];
    return retVal;
  }

  public getCount() {
    return this.children.reduce((r, c) =>  r + c.getCount(), 0);
  }

  public resize(width: number) {
    // TODO: Add resize logic for column group
    this.width = width;
  }

}

export class ColumnGroupDefinition extends React.Component<ColumnGroupProps, {}> {

  public static propTypes = {
    header: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}