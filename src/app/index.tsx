import * as React from 'react';
import { Dashboard } from 'app/containers/Dashboard';
import { BrowserRouter, Route, Switch  } from 'react-router-dom';
import TestComponent from './containers/test';

export class App extends React.Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path="/login/" component={TestComponent} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </BrowserRouter>
      </>
      );
  }
}
