import * as React from 'react';
import { autobind } from 'core-decorators';
import { ColumnChooserProps } from './ColumnChooser';

export default class Filter extends React.Component<{
  columnChooser: React.ReactElement<ColumnChooserProps>;
  showColumnChooser: boolean;
  onToggleVisibility: (isVisible: boolean) => void;
}, {}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showColumnChooser: false
    };
  }

  @autobind
  private toggleFilterPane() {
    const { showColumnChooser, onToggleVisibility } = this.props;
    onToggleVisibility(!showColumnChooser);
  }

  public render() {
    const { columnChooser, showColumnChooser } = this.props;
    return (
      <div>
        <button className='column-chooser-btn' onClick={this.toggleFilterPane} />
        {showColumnChooser && columnChooser}
      </div>
    );
  }
}


