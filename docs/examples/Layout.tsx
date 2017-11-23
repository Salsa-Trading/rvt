import * as React from 'react';

export default class LayoutTest extends React.Component<{}, {}> {
  public render() {
    const rows = (Array(1000).fill(undefined)).map(i => {
      return (
        <tr key={i}>
          <td>Stuff</td>
        </tr>
      );
    });

    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}
