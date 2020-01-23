import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import OrganizationTeamDetailsPage from './details';

interface RootPageParams {
    login: string;
    section: string;
}

interface Props extends RouteComponentProps<RootPageParams> {

}

export default class OrganizationTeamRootPage extends React.Component<Props> {
    render() {
        return (
            <Switch>
                <Route path={`/organizations/:login/teams/:id?`} login={this.props.match.params.login} component={OrganizationTeamDetailsPage} />
            </Switch>
        );
    };
}