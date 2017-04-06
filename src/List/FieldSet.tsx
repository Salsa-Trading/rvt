import * as React from 'react';
import { Field, FieldProps, FieldDefaults, FieldDisplay } from './Field';

export const RootFieldSet = '_root_';

export interface FieldSetProps extends React.Props<FieldSetProps> {
  name?: string;
  header?: JSX.Element|string;
  hidden?: boolean;
}

export class FieldSet {

  public name: string;
  public header: JSX.Element|string;
  public hidden?: boolean;
  public width?: number|string;
  public children: (Field|FieldSet)[];

  constructor(props: FieldProps, fieldDefaults: FieldDefaults, fields: FieldDisplay) {
    this.name = props.name;
    this.header = props.header;
    this.hidden = (fields && fields.hidden) || props.hidden;
    this.width = (fields && fields.width) || props.width;

    const children = React.Children.map(props.children, (c: any) => {
      let colDisplay = null;
      if(fields) {
        colDisplay = fields.children.find(cd => cd.name === c.props.name);
      }
      if(c.type.name === 'FieldSetDefinition') {
        return new FieldSet(c.props, fieldDefaults, colDisplay);
      }
      if(c.type.name === 'FieldDefinition') {
        return new Field({...fieldDefaults, ...c.props, ...colDisplay});
      }
    });
    if(!fields || !fields.children || fields.children.length === 0) {
      fields = {
        name: this.name,
        hidden: false,
        children: children.map(c => ({name: c.name, hidden: false}))
      };
    }
    this.children = fields.children.map(cd => children.find(c => cd.name === c.name));
  }

  public getFields(): Field[] {
    if(this.hidden) {
      return [];
    }
    let fields: Field[] = [];
    for(let field of this.children ) {
      fields = fields.concat(field.getFields());
    }
    return fields;
  }

  public moveField(newIndex: number, field: Field) {
    const oldIndex = this.children.indexOf(field);
    if(oldIndex >= 0) {
      this.children.splice(newIndex, 0, this.children.splice(oldIndex, 1)[0]);
      return true;
    }
    else {
      for(let child of this.children) {
        if(child instanceof FieldSet) {
          let moved = child.moveField(newIndex, field);
          if(moved) {
            return moved;
          }
        }
      }
    }
    return false;
  }

  public findFieldSetByName(field: string) {
    if(field === RootFieldSet) {
      return this;
    }
    for(let child of this.children) {
      if(child instanceof FieldSet) {
        if(child.name === field) {
          return child;
        }
        let found = child.findFieldSetByName(field);
        if(found) {
          return found;
        }
      }
    }
    return null;
  }

  public findParent(field: Field|FieldSet) {
    if(this.findFieldIndex(field) >= 0) {
      return this;
    }
    for(let child of this.children) {
      if(child instanceof FieldSet) {
        let found = child.findParent(field);
        if(found) {
          return found;
        }
      }
    }
    return null;
  }

  public findFieldIndex(field: Field|FieldSet) {
    return this.children.findIndex(c => c === field);
  }

  public getFieldIndex(index: number) {
    return this.children[index];
  }

  public getFieldDisplay(): FieldDisplay {
    return {
      name: this.name,
      width: this.width,
      hidden: this.hidden,
      children: this.children.map(c => c.getFieldDisplay())
    };
  }

  public getLevelCount(): number {
    let levels = 0;
    for(let child of this.children) {
      if(child.hidden) {
        continue;
      }
      if(child instanceof FieldSet) {
        levels = Math.max(levels, child.getLevelCount());
      }
    }
    return levels + 1;
  }

  public getLevels() {
    let levels = [];
    for(let child of this.children) {
      if(child.hidden) {
        continue;
      }
      if(child instanceof FieldSet) {
        let subLevels = child.getLevels();
        for(let i = 0; i < subLevels.length; i++) {
          levels[i] = (levels[i] || []).concat(subLevels[i]);
        }
      }
    }
    const retVal = [this.children.filter(c => !c.hidden), ...levels];
    return retVal;
  }

  public getCount() {
    return this.children.reduce((r, c) =>  r + c.getCount(), 0);
  }

  public resize(width: number) {
    // TODO: Add resize logic for field group
    this.width = width;
  }

}

export class FieldSetDefinition extends React.Component<FieldSetProps, {}> {

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
