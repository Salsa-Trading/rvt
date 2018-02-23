import * as React from 'react';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

import Navbar from './navbar';
import Home from './home';
import VirtualGrid from './examples/VirtualGrid';
import CustomGrid from './examples/CustomGrid';
import Style from './examples/Style';
import VirtualTable from './examples/VirtualTable';
import Grid from './examples/Grid';
import VirtualScroller from './examples/VirtualScroller';
import StreamingTable from './examples/StreamingTable';
import StreamingGrid from './examples/StreamingGrid';

export default class App extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <BrowserRouter>
        <div id='rvt-demo'>
          <header>
            <Navbar />
          </header>
          <main>
            <Route path='/home' component={Home} />
            <Route path='/examples/virtualTable' component={VirtualTable} />
            <Route path='/examples/style' component={Style} />
            <Route path='/examples/grid' component={Grid} />
            <Route path='/examples/virtualGrid' component={VirtualGrid} />
            <Route path='/examples/customGrid' component={CustomGrid} />
            <Route path='/examples/virtualScroller' component={VirtualScroller} />
            <Route path='/examples/streamingTable' component={StreamingTable} />
            <Route path='/examples/streamingGrid' component={StreamingGrid} />
          </main>
        </div>
      </BrowserRouter>
    );
  }
}
