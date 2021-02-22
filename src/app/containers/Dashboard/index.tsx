import * as React from "react";
import { Switch, Route } from "react-router";
import OrganizationsPage from "app/pages/organizations";
import OrganizationDetailsPage from "app/pages/organizations/details";
import RootPageComponent from "app/pages/RootPage";
import AddOrganizationPage from "app/pages/organizations/add";
import { Layout } from 'antd';

import LoginPage from "app/pages/auth/login";

import "./style.scss";
import AhoraHeader from "app/components/Basics/AhoraHeader";

export default class Dashboard extends React.Component {
  render() {
    const { Header } = Layout;
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <Header className="site-layout-background" >
              <AhoraHeader />
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