import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Input, Select } from "antd";
import { searchUsers, UserItem } from 'app/services/users';
import { debounce } from 'lodash';
import UserDetails from 'app/components/users/UserDetails';
import { addUsersToState, updateUserUsedInState } from 'app/store/users/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { ApplicationState } from 'app/store';

class UsersSelect extends Select<number[]> {

}

interface AhoraUsersFieldState {
    value?: number[];
    isLoading: boolean,
    options: UserItem[],
    query: string;
    recentUsers?: number[];
}

interface InjectableProps {
    recentUsers: Set<number>
}

interface DispatchProps {
    addUsersToStore(users: UserItem[]): void;
    updateRecentUser(userId: number): void;
}

interface Props extends DispatchProps, InjectableProps {
    value?: number[];
    fieldData: AhoraFormField;
    showUnassigned?: boolean;
    onChange: (value: number[]) => void;
}

class AhoraUsersField extends React.Component<Props, AhoraUsersFieldState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            options: [],
            query: "",
            value: this.props.value || []
        };

        this._handleSearch = debounce(this._handleSearch, 800);

    }

    onUpdate(value: number[]) {
        if (this.state.value) {
            if (value.length > this.state.value?.length) {
                this.props.updateRecentUser(value[value.length - 1])
            }
        }

        this.setState({ value });
        this.props.onChange(value);
    }

    onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
        event.stopPropagation();
        this.setState({ isLoading: true, query: event.target.value });
        this._handleSearch(event.target.value);
    }

    _handleSearch = async (query: string) => {
        if (query && query.length > 0) {
            const users = await searchUsers(query);
            this.props.addUsersToStore(users);
            this.setState({
                isLoading: false,
                options: users,
            });
        }
        else {
            this.setState({
                isLoading: false
            });
        }
    }

    dropDownChanged(open: boolean) {
        if (open) {
            this.setState({ recentUsers: [...this.props.recentUsers].reverse() })
        }
    }

    render() {
        return (
            <UsersSelect
                showSearch={false}
                mode="multiple"
                value={this.props.value}
                loading={this.state.isLoading}
                placeholder={<FormattedMessage id="selectUsers" />}
                dropdownStyle={{ minWidth: "400px" }}
                onSearch={this._handleSearch}
                onChange={this.onUpdate.bind(this)}
                onDropdownVisibleChange={this.dropDownChanged.bind(this)}
                dropdownRender={(menu) => {
                    return <>
                        {false && this.state.query.length === 0 &&
                            <>
                                {this.state.value?.map((userId) => <div><UserDetails userId={userId} /></div>)}
                            </>
                        }
                        <Input autoFocus={true} onChange={this.onInputChange.bind(this)}></Input>
                        {menu}
                    </>
                }}
            >

                {this.props.showUnassigned && <Select.Option key={"null"} value={"null"}><FormattedMessage id="unassigned" /></Select.Option>}
                {this.props.value &&
                    <Select.OptGroup label="selected" >
                        {this.props.value.map((userId) => <Select.Option key={`selected-${userId}`} value={userId}><UserDetails userId={userId} /></Select.Option>)}
                    </Select.OptGroup>}
                {(this.state.recentUsers && this.state.query.length === 0 && this.state.recentUsers.length > 0) &&
                    <Select.OptGroup label="Recent" >
                        {this.state.recentUsers.map((userId) => <Select.Option key={userId} value={userId}><UserDetails userId={userId} /></Select.Option>)}
                    </Select.OptGroup>
                }

                {(this.state.query.length > 0) &&
                    <Select.OptGroup label="Search Results" >
                        {this.state.options.map(user => (
                            <Select.Option key={user.id} value={user.id}><UserDetails user={user} /></Select.Option>
                        ))}
                    </Select.OptGroup>
                }

            </ UsersSelect>
        )
    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        recentUsers: state.users.recentUsers
    }
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addUsersToStore: (users: UserItem[]) => dispatch(addUsersToState(users)),
        updateRecentUser: (userId: number) => dispatch(updateUserUsedInState(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AhoraUsersField as any); 