import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import OrganizationsPage from "app/pages/organizations";
import OrganizationDetailsPage from "app/pages/organizations/details";
import CurrentUser from "app/components/CurrentUser";
import RootPageComponent from "app/pages/RootPage";
import AddOrganizationPage from "app/pages/organizations/add";
import { Layout } from 'antd';
import { Link } from "react-router-dom";

interface LoginParams { }

interface Props extends RouteComponentProps<LoginParams> {
  selectedMenu: number;
  actions: any;
  user: any;
}

interface State {
}

export class Dashboard extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, context?: any) {
    super(props, context);

    this.state = {
    };
  }



  openChangePassword = () => {
    return <></>;
  };

  async componentDidMount() { }

  render = () => {
    const { Header } = Layout;
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <Header className="site-layout-background" >

              <div className="logo" style={{ float: "left", width: "80px" }}>
                <Link to="/"><img src="/images/logo.svg" /></Link>
              </div>
              <CurrentUser style={{ float: 'right' }} ></CurrentUser>
            </Header>
            <Layout className="site-layout-content">
              <Switch>
                <Route exact path="/" component={RootPageComponent} />
                <Route path="/organizations/add" component={AddOrganizationPage} />
                <Route
                  path="/organizations/:login/:section?"
                  component={OrganizationDetailsPage}
                />
                <Route path="/organizations" component={OrganizationsPage} />
              </Switch>
            </Layout>
          </Layout>
        </Layout>
      </>
    );
  };
}
