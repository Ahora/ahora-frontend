import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Fragment } from 'react';
import SelectUser, { UserItem } from 'app/components/users/selectusers';
import { getUsersByOrganization, OrganizationUser, deleteUserMethod, addUser } from 'app/services/organizationUsers';
import Spinner from 'react-bootstrap/Spinner';

interface StatusesPageState {
    users: OrganizationUser[] | null;
}

interface StatusPageProps {
}

interface DispatchProps {
    requestLabelsData(): void;
}

interface AllProps extends StatusPageProps, DispatchProps {

}

export default class PeoplePage extends React.Component<AllProps, StatusesPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            users: null
        };
    }

    async componentDidMount() {
        const users = await getUsersByOrganization();
        this.setState({
            users
        });
    }

    async onSelectUser(user: UserItem) {
        const addedUser = await addUser(user.login);
        this.setState({
            users: [...this.state.users, addedUser]
        });
    }

    async deleteUser(user: OrganizationUser) {
        await deleteUserMethod(user);

        if (this.state.users) {
            //Keep all the other usets in state!
            this.setState({
                users: this.state.users.filter(u => u.id !== user.id)
            });
        }
    }

    render() {
        return (
            <div>
                <h2>People</h2>
                <div>
                    <Fragment>
                        <SelectUser onSelect={(user) => { this.onSelectUser(user) }} ></SelectUser>
                    </Fragment>
                </div>
                {this.state.users ?
                    <Table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Permission</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(this.state.users.map((user) => {
                                return (
                                    <tr className="pt-3" key={user.id}>
                                        <td>{user.user.displayName} ({user.user.username})</td>
                                        <td>{user.permission}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => { this.deleteUser(user); }}>Delete</Button>
                                        </td>
                                    </tr>);
                            }))}
                        </tbody>
                    </Table>
                    : (<div className="text-center"><Spinner animation="border" variant="primary" /></div>)
                }
            </div>
        );
    };
}