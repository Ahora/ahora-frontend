import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { addOrg, Organization } from 'app/services/organizations';
import OrganizationForm from 'app/components/Organization/OrganizationForm';
import { Typography } from 'antd';

interface Props extends RouteComponentProps {

}


export default class AddOrganizationPage extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    async onSumbit(orgData: Organization): Promise<void> {
        const addedOrg = await addOrg(orgData);
        this.props.history.replace(`/organizations/${addedOrg.login}/new`);
    }

    render() {
        return (
            <div className="main-content">
                <Typography.Title>Add Organization</Typography.Title>
                <OrganizationForm onUpdate={this.onSumbit.bind(this)} />
            </div>
        );
    };
}