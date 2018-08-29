import * as React from 'react';
import { FieldBase, FieldPropsBase, FieldDefaults, Field, FieldDisplay, FieldBasePropTypes } from './Field';

export const RootFieldSet = '_root_';

export interface FieldSetProps extends FieldPropsBase, React.Props<FieldSetProps> {
}
export class FieldSet extends FieldBase {

  public name: string;
  public header: JSX.Element|string;
  public width?: number|string;
  public children: FieldBase[];

  constructor(props: FieldSetProps, fieldDefaults: FieldDefaults, fields: FieldDisplay) {
    super(props, fields);

    let subFields = (fields && fields.children) || [];

    this.children = React.Children.map(props.children || [], (c: any) => {
      const field = subFields.find(cd => cd.name === c.props.name);
      if(c.type.name === 'FieldSetDefinition') {
        return new FieldSet(c.props, fieldDefaults, field as FieldDisplay);
      }
      if(c.type.name === 'FieldDefinition') {
        return new Field({...fieldDefaults, ...c.props}, field);
      }
    });
    // Sort defined fields by order in fields.chilren, if the defined field is not found place at the end
    this.children.sort((a, b) => {
      let aIndex = subFields.findIndex(f => f.name === a.name);
      if(aIndex < 0) {
        aIndex = Number.MAX_VALUE;
      }
      let bIndex = subFields.findIndex(f => f.name === b.name);
      if(bIndex < 0) {
        bIndex = Number.MAX_VALUE;
      }
      return aIndex - bIndex;
    });
  }

  public get hidden(): boolean {
    return this.children.every(f => f.hidden);
  }

  public set hidden(hide: boolean) {
    this.children.forEach(f => {
      if(!(f.showAlways && hide)) {
        f.hidden = hide;
      }
    });
  }

  public get partiallyHidden(): boolean {
    const someHidden = this.children.some(c => c.hidden);
    const someVisible = this.children.some(c => !c.hidden);
    const somePartial = this.children.filter(isFieldSet).some(c => c.partiallyHidden);
    return (someHidden && someVisible) || somePartial;
  }

  public getFields(): Field[] {
    if(this.hidden) {
      return [];
    }
    let fields: Field[] = [];
    for(let field of this.children) {
      if(!field.hidden) {
        fields = fields.concat(field.getFields());
      }
    }
    return fields;
  }

  public moveField(newIndex: number, field: FieldBase) {
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

  public findFieldByName(name: string): FieldBase {
    if(name === RootFieldSet) {
      return this;
    }
    for(let child of this.children) {
      if(child.name === name) {
        return child;
      }
      if(child instanceof FieldSet) {
        let found = child.findFieldByName(name);
        if(found) {
          return found;
        }
      }
    }
    return null;
  }

  public findParent(field: FieldBase): FieldSet {
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

  public findFieldIndex(field: FieldBase) {
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
      if(!isVisible(child)) {
        continue;
      }
      if(child instanceof FieldSet) {
        levels = Math.max(levels, child.getLevelCount());
      }
    }
    return levels + 1;
  }

  public getFieldCount() {
    return Math.max(this.children.reduce((r, c) => r + (isVisible(c) ? c.getFieldCount() : 0), 0), 1);
  }

  public resize(width: number) {
    // TODO: Add resize logic for field group
    this.width = width;
  }

}

export function isVisible(field: Field|FieldSet) {
  if(field.hidden) {
    return false;
  }
  if(field instanceof FieldSet) {
    return field.children.some(isVisible);
  }
  return true;
}

export class FieldSetDefinition extends React.Component<FieldSetProps, {}> {

  public static propTypes = FieldBasePropTypes;

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return null;
  }
}

export function isFieldSet(field: FieldBase): field is FieldSet {
  return Array.isArray(field['children']);
}
