import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import TestComponent from '../test';
import OrganizationsPage from 'app/pages/organizations/list';
import OrganizationDetailsPage from 'app/pages/organizations/details';
import { BrowserRouter } from 'react-router-dom';
import CurrentUser from 'app/components/CurrentUser';

interface LoginParams {
}

interface Props extends RouteComponentProps<LoginParams> {
  selectedMenu: number;
  actions: any;
  user: any;
}

interface State {
  user: any;
}

export class Dashboard extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, context?: any) {
    super(props, context);
  }

  openChangePassword = () => {
    return <></>;
  };

  async componentDidMount() {

  }

  render = () => {
    return (
      <>
        <Navbar bg="light">
          <Navbar.Brand>Ahora!</Navbar.Brand>
          <Nav className="mr-auto"></Nav>
          <CurrentUser></CurrentUser>
        </Navbar>
        <Container>
          <BrowserRouter>
            <Switch>
              <Route path="/organizations/:login/:section?" component={OrganizationDetailsPage} />
              <Route path="/organizations" component={OrganizationsPage} />
              <Route exact path="/" component={TestComponent} />
            </Switch>
          </BrowserRouter>
        </Container>
      </>
    );
  };
}
