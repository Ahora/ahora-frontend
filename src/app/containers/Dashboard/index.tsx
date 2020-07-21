import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import OrganizationsPage from "app/pages/organizations";
import OrganizationDetailsPage from "app/pages/organizations/details";
import CurrentUser from "app/components/CurrentUser";
import RootPageComponent from "app/pages/RootPage";
import AddOrganizationPage from "app/pages/organizations/add";
import { Layout } from 'antd';

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
    const { Header, Content, Footer } = Layout;
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <Header className="site-layout-background" >
              <div className="logo" style={{
                width: "120px",
                height: "31px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "16px 24px 16px 0",
                float: "left"
              }}>
                <a href="/">Ahora!</a>
              </div>
              <CurrentUser style={{ float: 'right' }} ></CurrentUser>
            </Header>
            <Content>
              <Switch>
                <Route exact path="/" component={RootPageComponent} />
                <Route path="/organizations/add" component={AddOrganizationPage} />
                <Route
                  path="/organizations/:login/:section?"
                  component={OrganizationDetailsPage}
                />
                <Route path="/organizations" component={OrganizationsPage} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </>
    );
  };
}
