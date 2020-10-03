import * as React from 'react';
import { getOrganizations, Organization } from 'app/services/organizations';
import { Link } from 'react-router-dom';
import { Typography, Menu, Space, Button, List } from 'antd';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';

interface OrganizationsPageState {
    organizations?: Organization[];
}

export default class OrganizationsPage extends React.Component<any, OrganizationsPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        const organizations: Organization[] = await getOrganizations();
        this.setState({ organizations });
    }
    render = () => {
        return (
            <div className="wrap-content">
                <Typography.Title>Organizations</Typography.Title>

                {this.state.organizations ?
                    <>
                        <Menu mode="horizontal">
                            <Space>
                                <Button type="primary" href={`/organizations/add`}>Add</Button>
                            </Space>
                        </Menu>
                        <List
                            bordered
                            dataSource={this.state.organizations}
                            renderItem={org => (
                                <List.Item>
                                    <Typography.Text>
                                        <Link to={`/organizations/${org.login}/inbox`}>{org.displayName}</Link></Typography.Text>
                                </List.Item>
                            )}
                        />
                    </> :
                    <AhoraSpinner></AhoraSpinner>
                }
            </div>
        );
    }

};
