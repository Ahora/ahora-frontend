import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import SelectUser from 'app/components/users/selectusers';
import { UserItem } from 'app/services/users';

interface GroupBySelectState {
    value?: number;
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onUpdate: (value?: number) => void;
}


class AhoraUserField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);
        this.state = { value: this.props.value };
    }

    async handleChange(user: UserItem) {
        this.setState({ value: user.id });
        this.props.onUpdate(user.id);

    }

    render() {
        return (
            <SelectUser editMode={true} onSelect={this.handleChange.bind(this)} ></SelectUser>
        );
    }
}

export default AhoraUserField;