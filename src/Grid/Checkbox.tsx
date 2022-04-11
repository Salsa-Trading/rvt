import * as React from 'react';
import {autobind} from 'core-decorators';
import {omit, isBoolean} from 'lodash';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  indeterminate?: boolean;
};

export class Checkbox extends React.Component<CheckboxProps, {
}> {
  private el: HTMLInputElement;

  public componentDidMount() {
    this.el.indeterminate = this.props.indeterminate;
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      this.el.indeterminate = this.props.indeterminate;
    }
  }

  @autobind
  private refFn(ref: HTMLInputElement) {
    this.el = ref;
  }

  public render(): React.ReactNode {
    const props = omit(this.props, 'indeterminate');

    // Adding key due to React v16.6 checkbox re-render bug
    const key = isBoolean(props.checked)
      ? props.checked.toString()
      : 'undefined';

    return (
      <input
        {...props}
        key={key}
        type='checkbox'
        ref={this.refFn}
      />
    );
  }
}
