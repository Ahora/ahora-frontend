import * as React from 'react';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import { addUser, OrganizationTeamUser, TeamUserType } from 'app/services/organizationTeams';
import AhoraField from '../Forms/AhoraForm/AhoraField';

interface Props {
    onUserAdded(user: OrganizationTeamUser): void;
    teamId: number | null;
}

interface State {
    form: any;
}

export class AddTeamMemberForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { permissionType: TeamUserType.Member }
        }
    }

    cancelAdd() {
        this.setState({
            form: { permissionType: TeamUserType.Member }
        });
    }

    async onSubmit(data: any) {
        const addedUser: OrganizationTeamUser = await addUser(data.userId, this.props.teamId, data.permissionType);
        this.props.onUserAdded(addedUser);

        this.setState({ form: { permissionType: TeamUserType.Member } });
    }

    render() {
        return (
            <AhoraForm submitButtonText="Add" data={this.state.form} onSumbit={this.onSubmit.bind(this)}>
                <AhoraField fieldName="userId" displayName="User" fieldType="user" required={true} />
                <AhoraField fieldName="permissionType" displayName="Permission" fieldType="enum" required={true} settings={{ enum: TeamUserType, keys: ["Member", "Owner"] }} />
            </AhoraForm>
        );
    }
}