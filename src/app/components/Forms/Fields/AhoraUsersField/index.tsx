import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from "antd";
import { searchUsers, UserItem } from 'app/services/users';
import { debounce } from 'lodash';
import AhoraSpinner from '../../Basics/Spinner';
import UserDetails from 'app/components/users/UserDetails';
import { addUsersToState } from 'app/store/users/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

class UsersSelect extends Select<number[]> {

}

interface AhoraUsersFieldState {
    value?: number[];
    isLoading: boolean,
    options: UserItem[],

}

interface DispatchProps {
    addUsersToStore(users: UserItem[]): void;
}

interface Props extends DispatchProps {
    value?: number[];
    fieldData: AhoraFormField;
    onChange: (value: number[]) => void;
}


class AhoraUsersField extends React.Component<Props, AhoraUsersFieldState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            options: [],
            value: this.props.value
        };

        this._handleSearch = debounce(this._handleSearch, 800);

    }

    onUpdate(value: number[]) {
        this.setState({ value });
        this.props.onChange(value);
    }

    _handleSearch = async (query: string) => {
        if (query && query.length > 0) {
            this.setState({ isLoading: true });

            const users = await searchUsers(query);
            this.props.addUsersToStore(users);
            this.setState({
                isLoading: false,
                options: users,
            });
        }
        else {
            this.setState({
                isLoading: false,
                options: [],
            });
        }
    }

    render() {
        return (
            <UsersSelect
                showSearch={true}
                mode="multiple"
                loading={this.state.isLoading}
                placeholder="Select users"
                notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                filterOption={false}
                onSearch={this._handleSearch}
                onChange={this.onUpdate.bind(this)}>
                {this.state.options.map(user => (
                    <Select.Option key={user.id} value={user.id}><UserDetails user={user} /></Select.Option>
                ))}
            </ UsersSelect>
        )
    }
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addUsersToStore: (users: UserItem[]) => dispatch(addUsersToState(users))
    }
}

export default connect(null, mapDispatchToProps)(AhoraUsersField as any); 