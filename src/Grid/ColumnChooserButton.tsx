import * as React from 'react';

export default class Filter extends React.Component<{
  columnChooser: any;
}, {
  showColumnChooser: boolean;
}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showColumnChooser: false
    };
  }

  private toggleFilterPane() {
    this.setState({showColumnChooser: !this.state.showColumnChooser });
  }

  private renderColumnChooserPane() {
    const { columnChooser } = this.props;
    return (
      <div className='column-chooser-pane'>
        {columnChooser}
      </div>
    );
  }

  public render() {
    const { showColumnChooser } = this.state;
    return (
      <div>
        <button className='column-chooser-btn' onClick={this.toggleFilterPane.bind(this)} />
        {showColumnChooser && this.renderColumnChooserPane()}
      </div>
    );
  }
}
