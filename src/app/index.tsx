import * as React from 'react';
import Dashboard from 'app/containers/Dashboard';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import localMap from './../Internationalization';
import { ApplicationState } from './store';
import { connect } from 'react-redux';

interface AppProps {
  messages: any;
  locale?: string;
  isRTL: boolean;
}

function AppComponent(props: AppProps) {
  return (
    <ConfigProvider direction={props.isRTL ? "rtl" : "ltr"}>
      <IntlProvider messages={props.messages} locale={props.locale || "en"} defaultLocale="en">
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  );
}

const mapStateToProps = (state: ApplicationState, ownProps: AppProps): AppProps => {
  if (state.organizations.currentOrganization) {
    return {
      messages: (localMap as any)[state.organizations.currentOrganization.locale || "en"],
      locale: state.organizations.currentOrganization.locale || "en",
      isRTL: state.organizations.currentOrganization.isRTL
    }
  }
  else {
    return ownProps;
  }
};

export const App = connect(mapStateToProps)(AppComponent as any) as any; 
