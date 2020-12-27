import * as React from "react";
import { UserItem, searchUsers } from "app/services/users";
import { Select } from "antd";
import AhoraSpinner from "../Forms/Basics/Spinner";
import UserDetails from "./UserDetails";
import { debounce } from "lodash";
import { connect } from "react-redux";
import { addUsersToState } from "app/store/users/actions";
import { Dispatch } from 'redux';

interface DispatchProps {
    addUsersToStore(users: UserItem[]): void;
}

interface SelectUserProps extends DispatchProps {
    onSelect(user: UserItem): void;
    currentUserId?: number,
    editMode?: boolean;
}


interface State {
    isLoading: boolean,
    options: UserItem[],
    query: string;
    editMode: boolean;
}

class SelectUser extends React.Component<SelectUserProps, State> {

    constructor(props: SelectUserProps) {
        super(props);
        this.state = {
            isLoading: false,
            options: [],
            query: '',
            editMode: (props.editMode === undefined) ? true : props.editMode
        };

        this._handleSearch = debounce(this._handleSearch, 800);

    }

    onBlur() {
        this.setState({
            editMode: true,
        });
    }

    onStartEdit() {
        this.setState({
            editMode: true,
        });
    }

    onChange(user: any) {
        this.props.onSelect(user.label.props.user);
        this.setState({
            editMode: false,
            query: ''
        });
    }

    render() {
        if (this.state.editMode) {
            return (
                <Select
                    showSearch={true}
                    autoClearSearchValue={true}
                    labelInValue
                    loading={this.state.isLoading}
                    style={{ minWidth: "300px" }}
                    placeholder="Select users"
                    notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                    filterOption={false}
                    onSearch={this._handleSearch}
                    onSelect={this.onChange.bind(this)}
                    onChange={this._handleInputChange}>
                    {this.state.options.map(user => (
                        <Select.Option key={user.id} value={user.id.toString()}><UserDetails user={user} /></Select.Option>
                    ))}
                </ Select>
            );
        }
        else {
            if (this.props.currentUserId) {
                return (<span onClick={this.onStartEdit.bind(this)}><UserDetails userId={this.props.currentUserId}></UserDetails></span>)
            }
            else {
                return (<span onClick={this.onStartEdit.bind(this)}>Unassigned</span>)
            }
        }
    }

    _handleInputChange = (query: string) => {
        this.setState({ query });
    }

    _handleSearch = async (query: string) => {
        this.setState({ isLoading: true });

        const users = await searchUsers(query);
        this.props.addUsersToStore(users);
        this.setState({
            isLoading: false,
            options: users,
        });
    }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addUsersToStore: (users: UserItem[]) => dispatch(addUsersToState(users))
    }
}

export default connect(null, mapDispatchToProps)(SelectUser as any); 