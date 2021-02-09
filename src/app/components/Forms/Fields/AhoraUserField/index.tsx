import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import SelectUser from 'app/components/users/selectusers';
import { UserType } from 'app/services/users';

interface GroupBySelectState {
    value?: number;
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onChange: (value?: number) => void;
}


class AhoraUserField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);
        this.state = { value: this.props.value };
    }

    async handleChange(userId?: number) {
        this.setState({ value: userId });
        this.props.onChange(userId);
    }

    render() {
        return (
            <SelectUser userType={UserType.User} editMode={true} onSelect={this.handleChange.bind(this)} ></SelectUser>
        );
    }
}

export default AhoraUserField;