import * as React from 'react';

export default class Filter extends React.Component<{
  columnChooser: any;
  showColumnChooser: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
}, {}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showColumnChooser: false
    };
  }

  private toggleFilterPane() {
    const { showColumnChooser, onToggleVisibility } = this.props;
    onToggleVisibility(!showColumnChooser);
  }

  public render() {
    const { columnChooser, showColumnChooser } = this.props;
    return (
      <div>
        <button className='column-chooser-btn' onClick={this.toggleFilterPane.bind(this)} />
        {showColumnChooser && columnChooser}
      </div>
    );
  }
}
