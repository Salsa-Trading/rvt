import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Navbar from './navbar';
import Home from './home';

import Grid from './examples/Grid';
import Layout from './examples/Layout';
import Style from './examples/Style';
import VirtualTable from './examples/VirtualTable';

export default class App extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <div id='rvt-demo'>
        <Navbar />
        <main>
          <Router history={browserHistory}>
            <Route path='/home' component={Home} />
            <Route path='/examples/'>
              <Route path='virtualTable' component={VirtualTable} />
              <Route path='style' component={Style} />
              <Route path='layout' component={Layout} />
              <Route path='grid' component={Grid} />
            </Route>
          </Router>
        </main>
      </div>
    );
  }
}
