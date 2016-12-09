import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Navbar from './navbar';
import Home from './home';

export default class App extends React.Component<{}, {}> {

  constructor(props, context) {
    super(props, context);
  }

  public render() {
    return (
      <div>
        <Navbar />
        <Router history={browserHistory}>
          <Route path='/' component={Home} />
        </Router>
      </div>
    );
  }
}
