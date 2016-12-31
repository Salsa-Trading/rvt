import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Navbar from './navbar';
import Home from './home';

import Grid from './examples/Grid';
import Style from './examples/Style';
import Table from './examples/Table';

export default class App extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <div>
        <Navbar />
        <Router history={browserHistory}>
          <Route path='/home' component={Home} />
          <Route path='/examples/'>
            <Route path='table' component={Table} />
            <Route path='style' component={Style} />
            <Route path='grid' component={Grid} />
          </Route>
        </Router>
      </div>
    );
  }
}
