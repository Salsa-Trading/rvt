import * as React from 'react';
import { Field } from '../List/Field';
import { FieldSet } from '../List/FieldSet';

export type ColumnChooserProps = {
  fieldSet: FieldSet;
  onHiddenChange?: (hidden: boolean, field: Field|FieldSet) => void;
};

export default class ColumnChooser extends React.Component<ColumnChooserProps, void> {

  public static propTypes = {
    fieldSet: React.PropTypes.any
  };

  constructor(props, context) {
    super(props, context);
  }

  private onChange(field: Field|FieldSet, e: React.ChangeEvent<HTMLInputElement>) {
    const { onHiddenChange } = this.props;
    if(onHiddenChange) {
      onHiddenChange(!e.target.checked, field);
    }
  }

  private renderFieldSet(fieldSet: FieldSet) {
    return (
      <ul>
        {fieldSet.children.map(field => {
          let children;
          if(field instanceof FieldSet) {
            children = this.renderFieldSet(field);
          }
          let name = field.name;
          if(typeof field.header === 'string' || field.header instanceof String) {
            name = field.header as string;
          }
          return <li key={field.name}>
            <label>
              <input
                type='checkbox'
                id={field.name}
                checked={!field.hidden}
                onChange={this.onChange.bind(this, field)}
              />
              {name}
            </label>
            {children}
          </li>;
        })}
      </ul>
    );
  }

  public render() {
    const {
      fieldSet
    } = this.props as any;

    return this.renderFieldSet(fieldSet);
  }
}


