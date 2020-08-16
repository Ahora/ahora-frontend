import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import OrganizationsPage from "app/pages/organizations";
import OrganizationDetailsPage from "app/pages/organizations/details";
import CurrentUser from "app/components/CurrentUser";
import RootPageComponent from "app/pages/RootPage";
import AddOrganizationPage from "app/pages/organizations/add";
import { Layout, Drawer, Menu } from 'antd';
import { Link } from "react-router-dom";
import { PieChartOutlined, UnorderedListOutlined, TeamOutlined, FlagOutlined } from "@ant-design/icons";

interface LoginParams { }

interface Props extends RouteComponentProps<LoginParams> {
  selectedMenu: number;
  actions: any;
  user: any;
}

interface State {
  drawerVisible: boolean,
}

export class Dashboard extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {};

  constructor(props: Props, context?: any) {
    super(props, context);

    this.state = {
      drawerVisible: false,
    };
  }

  openDrawer() {
    this.setState({ drawerVisible: true });
  }

  onDrawerClose() {
    this.setState({ drawerVisible: false });

  }


  async componentDidMount() { }

  render = () => {
    const { Header } = Layout;
    const organization = { login: "assistedinstaller" };
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <Header className="site-layout-background" >

              <div style={{ float: "left" }}>
                <div className="logo" style={{ width: "80px" }}>
                  <Link to="/"><img src="/images/logo.svg" /></Link>
                </div>
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
          <Drawer
            onClose={this.onDrawerClose.bind(this)}
            placement="left"
            closeIcon={true}
            closable={true}
            visible={this.state.drawerVisible}
          >
            <Menu mode="vertical">
              <Menu.Item icon={<PieChartOutlined />} key="dashboards"><Link to={`/organizations/${organization.login}/dashboards`}>Dashboards</Link></Menu.Item>
              <Menu.Item icon={<UnorderedListOutlined />} key="docs"><Link to={`/organizations/${organization.login}/docs`}>Browse</Link></Menu.Item>
              <Menu.Item icon={<TeamOutlined />} key="teams"><Link to={`/organizations/${organization.login}/teams`}>Teams</Link></Menu.Item>
              <Menu.Item icon={<FlagOutlined />} key="milestones"><Link to={`/organizations/${organization.login}/milestones`}>Milestones</Link></Menu.Item>
            </Menu>
          </Drawer>
        </Layout>
      </>
    );
  };
}
