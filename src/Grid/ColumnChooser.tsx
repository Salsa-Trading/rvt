import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Field } from '../List/Field';
import { FieldSet } from '../List/FieldSet';
import safeMouseDown from '../utils/safeMouseDown';

export type ColumnChooserProps = {
  fieldSet: FieldSet;
  onHiddenChange?: (hidden: boolean, field: Field|FieldSet) => void;
  onToggleVisibility: (isVisible: boolean) => void;
};

export default class ColumnChooser extends React.Component<ColumnChooserProps, void> {

  public static propTypes = {
    fieldSet: PropTypes.any
  };

  private mouseDownHandler: () => void;

  constructor(props, context) {
    super(props, context);
  }

  public componentDidMount() {
    const { onToggleVisibility } = this.props;
    this.mouseDownHandler = safeMouseDown<HTMLElement>((e) => {
      if(!(e as any).target.closest('.column-chooser-btn') &&
         !(e as any).target.closest('.column-chooser-pane')) {
        onToggleVisibility(false);
      }
    });
  }

  public componentWillUnmount() {
    if(this.mouseDownHandler) {
      this.mouseDownHandler();
    }
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
                disabled={field.showAlways || field.sortDirection || field.filter}
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

    return (
      <div className='column-chooser-pane'>
        {this.renderFieldSet(fieldSet)}
      </div>
    );
  }
}


