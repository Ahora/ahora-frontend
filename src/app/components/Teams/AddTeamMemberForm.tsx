import * as React from 'react';
import { AhoraFormField } from '../Forms/AhoraForm/data';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import { addUser, OrganizationTeamUser, TeamUserType } from 'app/services/organizationTeams';

interface Props {
    onUserAdded(user: OrganizationTeamUser): void;
    teamId: number | null;
}

interface State {
    form: any;
    fields: AhoraFormField[];
}

export class AddTeamMemberForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { permissionType: TeamUserType.Member },
            fields: [
                {
                    displayName: "User",
                    fieldName: "userId",
                    fieldType: "user",
                    required: true

                }, {
                    displayName: "permission",
                    fieldName: "permissionType",
                    fieldType: "teamuserpermission",
                    required: true
                }]
        }
    }

    cancelAdd() {
        this.setState({
            form: { permissionType: TeamUserType.Member }
        });
    }

    async onSubmit(data: any) {
        console.log(data);
        const addedUser: OrganizationTeamUser = await addUser(data.userId, this.props.teamId, data.permissionType);
        this.props.onUserAdded(addedUser);

        this.setState({ form: { permissionType: TeamUserType.Member } });
    }

    render() {
        return (
            <AhoraForm submitButtonText="Add" fields={this.state.fields} data={this.state.form} onSumbit={this.onSubmit.bind(this)} />
        );
    }
}