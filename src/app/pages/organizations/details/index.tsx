import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { Organization, getOrganizations } from 'app/services/organizations';
import { BrowserRouter } from 'react-router-dom';
import VideosPage from 'app/pages/projects/videos';

interface VideosDetailsPageState {
    organization: Organization | null;
}

interface OrganizationPageParams {
    login: string;
}


interface Props extends RouteComponentProps<OrganizationPageParams> {

}


export default class OrganizationDetailsPage extends React.Component<Props, VideosDetailsPageState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            organization: null
        };
    }

    async componentDidMount() {
        const organizations: Organization[] = await getOrganizations();
        const organization: Organization = organizations.filter(x=> x.login === this.props.match.params.login)[0];
        this.setState({
            organization
        });
    }
    render = () => {
        const organization = this.state.organization;
        if (organization) {
            return (
                <div>
                    <h2>{organization.login}</h2>
                    <p>{organization.description}</p>
                    <BrowserRouter>
                        <Switch>
                            <Route path={`/organizations/:login/videos`} component={VideosPage} />
                        </Switch>
                    </BrowserRouter>
                    <p><a href={`/organizations/${organization.login}/videos`}>Link to Videos</a></p>
                </div>
            );
        }
        else {
            return (<div>Loading....</div>)
        }

    };
}
