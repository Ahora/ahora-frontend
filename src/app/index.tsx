import * as React from 'react';
import { Dashboard } from 'app/containers/Dashboard';
import { Route, Switch } from 'react-router';
import TestComponent from './containers/test';
import { BrowserRouter } from 'react-router-dom';

export class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login/" component={TestComponent} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}
