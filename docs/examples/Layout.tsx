import * as React from 'react';

export default class LayoutTest extends React.Component<{
}, {}> {
  public render() {
    const rows = (Array(1000).fill(undefined)).map(() => {
      return <tr>
        <td>Stuff</td>
      </tr>;
    });

    console.log(rows);

    return <table>
      <tbody>
        {rows}
      </tbody>
    </table>;
  }
}
