import * as React from 'react';
import {autobind} from 'core-decorators';

export default class TabTitle extends React.PureComponent < {
  title: any;
  updateTitle: (title: string) => void;
}, {
  inputTitle: string;
  editing: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      inputTitle: props.title
    };
  }

  public componentWillReceiveProps(props) {
    if(!this.state.editing) {
      this.setState({inputTitle: props.title});
    }
  }

  @autobind
  private submitFn(e: React.FormEvent<HTMLFormElement>) {
    const {title, updateTitle} = this.props;
    const {inputTitle} = this.state;
    
    updateTitle(inputTitle);
    this.setState({
      editing: false,
      inputTitle: inputTitle
    });
    e.preventDefault();
  }

  private editTitleForm(): React.ReactElement<any> {
    const {title} = this.props;
    const {inputTitle} = this.state;

    const onChange = (e) => {
      this.setState({inputTitle: e.target.value});
    };

    const onBlur = (e) => {
      this.setState({
        editing: false,
        inputTitle: title
      });
    };

    const onFocus = (e) => {
      e.target.select();
    };

    return (
      <form onSubmit={this.submitFn} style={{display: 'inline-block'}}>
        <input
          value={inputTitle}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          minLength={1}
          autoFocus
        />
      </form>
    );
  }

  public render() {
    const {title} = this.props;
    const {editing} = this.state;

    const onDoubleClick = () => {
      this.setState({editing: true});
    };

    return (
      <span>
        <span className='tab-title' onDoubleClick={onDoubleClick}>
          {editing ? this.editTitleForm() : title}
        </span>
    </span>
    );
  }
}
