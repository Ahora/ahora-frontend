import * as React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import OrganizationsPage from "app/pages/organizations";
import OrganizationDetailsPage from "app/pages/organizations/details";
import CurrentUser from "app/components/CurrentUser";
import RootPageComponent from "app/pages/RootPage";
import AddOrganizationPage from "app/pages/organizations/add";
import { Layout, Button, Badge } from 'antd';
import { Link } from "react-router-dom";
import { InboxOutlined } from "@ant-design/icons";
import { ApplicationState } from "app/store";
import { connect } from "react-redux";
import { Organization } from "app/services/organizations";
import LoginPage from "app/pages/auth/login";

import "./style.scss";

interface InjectedProps {
  organization?: Organization,
  unReadCount?: number
}

interface Props extends RouteComponentProps, InjectedProps {
  selectedMenu: number;
  actions: any;
  user: any;
}


interface State {
  drawerVisible: boolean,
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context);
  }

  render() {
    const { Header } = Layout;
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <Header className="site-layout-background" >

              <div className="logocontainer">
                <div className="logo" style={{ width: "80px" }}>
                  <Link to="/"><img src="/images/logo.svg" /></Link>
                </div>
              </div>
              <div className="rightside">
                <CurrentUser></CurrentUser>
                {this.props.organization &&
                  <Link title="Inbox" to={`/organizations/${this.props.organization.login}/inbox`}>
                    <Badge count={this.props.unReadCount}>
                      <Button type="text" style={{ color: "#000000" }} icon={<InboxOutlined></InboxOutlined>} />
                    </Badge>
                  </Link>
                }
              </div>
            </Header>
            <Layout className="site-layout-content">
              <Switch>
                <Route exact path="/" component={RootPageComponent} />
                <Route exact path="/login" component={LoginPage} />
                <Route path="/organizations/add" component={AddOrganizationPage} />
                <Route path="/organizations/:login/:section?" component={OrganizationDetailsPage} />
                <Route path="/organizations" component={OrganizationsPage} />
              </Switch>
            </Layout>
          </Layout>
        </Layout>
      </>
    );
  };
}

const mapStateToProps = (state: ApplicationState): InjectedProps => {
  return {
    organization: state.organizations.currentOrganization,
    unReadCount: state.shortcuts.map.get("inbox")?.unreadDocs?.size
  };
};

export default connect(mapStateToProps, null)(Dashboard as any);
