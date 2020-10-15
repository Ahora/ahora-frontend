import * as React from 'react';
import UserList from '../../../users/UserList';
import { AhoraFormField } from '../../AhoraForm/data';

interface AhoraUsersFieldState {
    value?: number[];
}

interface Props {
    value?: number[];
    fieldData: AhoraFormField;
    onChange: (value: number[]) => void;
}


export default class AhoraUsersField extends React.Component<Props, AhoraUsersFieldState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value
        };
    }

    onUpdate(value: number[]) {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (<UserList selectedUsers={this.props.value} onChange={this.onUpdate.bind(this)} canEdit={true}></UserList>)
    }
}