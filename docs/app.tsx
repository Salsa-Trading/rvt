import * as React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Navbar from './navbar';
import Home from './home';

import VirtualGrid from './examples/VirtualGrid';
import CustomGrid from './examples/CustomGrid';
import Layout from './examples/Layout';
import Style from './examples/Style';
import VirtualTable from './examples/VirtualTable';

const history = createBrowserHistory();

export default class App extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <Router history={history}>
        <div id='rvt-demo'>
          <Navbar />
          <main>
            <Route path='/home' component={Home} />
            <Route path='/examples/virtualTable' component={VirtualTable} />
            <Route path='/examples/style' component={Style} />
            <Route path='/examples/layout' component={Layout} />
            <Route path='/examples/virtualGrid' component={VirtualGrid} />
            <Route path='/examples/customGrid' component={CustomGrid} />
          </main>
        </div>
      </Router>
    );
  }
}
