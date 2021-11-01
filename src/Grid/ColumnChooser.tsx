import { autobind } from 'core-decorators';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Field, FieldBase } from '../List/Field';
import { FieldSet, isFieldSet } from '../List/FieldSet';
import safeMouseDown from '../utils/safeMouseDown';
import { Checkbox } from './Checkbox';

export type ColumnChooserProps = {
  fieldSet: FieldSet;
  onHiddenChange?: (hidden: boolean, field: Field|FieldSet) => void;
  onToggleVisibility: (isVisible: boolean) => void;
};

export interface ColumnChooserState {
  showFilter: boolean;
  filter: string;
}

@autobind
export default class ColumnChooser extends React.Component<ColumnChooserProps, ColumnChooserState> {

  public static propTypes = {
    fieldSet: PropTypes.any
  };

  private mouseDownHandler: () => void;

  public state: ColumnChooserState = {
    showFilter: false,
    filter: ''
  };

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

  private renderFieldSet(fieldSet: FieldSet, filter: string) {
    const filteredChildren = fieldSet.children.filter((c: FieldBase) => c.containsString(filter));

    return (
      <div>
        <ul>
          {filteredChildren.map(field => {
            let children;
            if(field instanceof FieldSet) {
              children = this.renderFieldSet(field, filter);
            }
            let name = field.name;
            if(typeof field.header === 'string' || field.header instanceof String) {
              name = field.header as string;
            }
            return (
              <li key={field.name}>
                <label>
                  <Checkbox
                    id={field.name}
                    checked={!field.hidden}
                    disabled={!field.hidden && field.showAlways}
                    onChange={this.onChange.bind(this, field)}
                    indeterminate={isFieldSet(field) ? field.partiallyHidden : false}
                  />
                  {name}
                </label>
                {children}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  private every(fieldSet: FieldSet, shouldBeVisible: boolean): boolean {
    const parentIsVisible = !fieldSet.hidden;
    const parentState = parentIsVisible === shouldBeVisible;
    const childrenState = fieldSet.children.every((f) => {
      if (isFieldSet(f)) {
        return this.every(f, shouldBeVisible);
      } else {
        const childIsVisisble = !f.hidden;
        return childIsVisisble === shouldBeVisible;
      }
    });
    return parentState && childrenState;
  }

  private setAll(fieldSet: FieldSet, shouldBeVisible: boolean): void {
    this.props.onHiddenChange(!shouldBeVisible, fieldSet);
  }

  private toggleFilter() {
    const {showFilter} = this.state;
    this.setState({
      showFilter: !showFilter,
      filter: ''
    });
  }

  private setFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const {value} = event.target;
    this.setState({filter: value});
  }

  public render() {
    const {
      fieldSet
    } = this.props as any;

    const {filter, showFilter} = this.state;

    return (
      <div className='column-chooser-pane'>
        <div className='btn-group' style={{width: '100%'}}>
          <label className='btn btn-sm btn-secondary'>
            <input
              type='checkbox'
              checked={this.every(fieldSet, true)}
              onChange={() => this.setAll(fieldSet, true)}
            />
            All
          </label>
          <label className='btn btn-sm btn-secondary'>
            <input
              type='checkbox'
              checked={this.every(fieldSet, false)}
              onChange={() => this.setAll(fieldSet, false)}
            />
            None
          </label>
          <button
            className={`btn btm-small btn-secondary edit-filters ${showFilter ? 'active' : ''}`}
            onClick={this.toggleFilter}
          />
        </div>
        {showFilter || filter ? (
          <div>
            <input
              type='search'
              className='form-control'
              placeholder='Filter'
              value={filter}
              onChange={this.setFilter}
              autoFocus={true}
            />
          </div>
        ) : null}
        {this.renderFieldSet(fieldSet, filter)}
      </div>
    );
  }
}


