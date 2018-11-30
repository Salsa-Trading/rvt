import * as React from 'react';
import { autobind } from 'core-decorators';
import { omit } from 'lodash';

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

    return (
      <input
        {...props}
        // Adding key due to react v16.6 re-render bug
        key={props.value.toString()}
        type='checkbox'
        ref={this.refFn}
      />
    );
  }
}
