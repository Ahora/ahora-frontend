import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';
import { TeamUserType } from 'app/services/organizationTeams';

interface GroupBySelectState {
    value: TeamUserType;
}

interface GroupBySelectStateProps {
    value: TeamUserType;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


class AhoraTeamUserPermissionField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = { value: this.props.value };
    }


    handleChange(event: any) {
        this.setState({ value: event.target.value });
        this.props.onUpdate(event.target.value);

    }

    render() {
        return (
            <Form.Control required={this.props.fieldData.required} value={this.props.value.toString()} name="permissionType" onChange={this.handleChange.bind(this)} as="select">
                <option value="0">Member</option>
                <option value="1">Owner</option>
            </Form.Control>
        );
    }
}

export default AhoraTeamUserPermissionField;