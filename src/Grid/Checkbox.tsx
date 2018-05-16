import * as React from 'react';
import {autobind} from 'core-decorators';

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
    return (
      <input
        {...this.props}
        type='checkbox'
        ref={this.refFn}
      />
    );
  }
}
