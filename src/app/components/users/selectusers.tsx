import * as React from "react";
import { UserItem, searchUsers, UserType } from "app/services/users";
import { Select } from "antd";
import AhoraSpinner from "../Forms/Basics/Spinner";
import UserDetails from "./UserDetails";
import { debounce } from "lodash";
import { connect } from "react-redux";
import { addUsersToState } from "app/store/users/actions";
import { Dispatch } from 'redux';
import { FormattedMessage } from "react-intl";

interface DispatchProps {
    addUsersToStore(users: UserItem[]): void;
}

interface SelectUserProps extends DispatchProps {
    onSelect(number: number | null): void;
    currentUserId?: number,
    editMode?: boolean;
    autoFocus?: boolean;
    userType?: UserType;
    showUnassigned?: boolean
}


interface State {
    isLoading: boolean,
    options: UserItem[],
    currentUserId: number | null | undefined;
    editMode: boolean;
}

class SelectUser extends React.Component<SelectUserProps, State> {

    constructor(props: SelectUserProps) {
        super(props);
        this.state = {
            currentUserId: undefined,
            isLoading: false,
            options: [],
            editMode: (props.editMode === undefined) ? true : props.editMode
        };

        this._handleSearch = debounce(this._handleSearch, 500);

    }

    componentDidMount() {
        if (!this.state.options) {
            this._handleSearch("");
        }
    }

    onStartEdit() {
        this.setState({
            editMode: true,
        });
    }

    onBlur() {
        this.setState({
            editMode: this.props.editMode || false,
            currentUserId: this.props.currentUserId
        });
    }

    onChange(user: any) {
        let userId: number | null = null
        if (user.value !== "") {
            userId = user.label.props.user.id;
        }
        this.props.onSelect(userId);

        this.setState({
            editMode: this.props.editMode || false,
            currentUserId: userId
        });
    }

    render() {
        if (this.state.editMode) {
            return (
                <Select
                    defaultOpen={true}
                    autoFocus={this.props.autoFocus}
                    showSearch={true}
                    autoClearSearchValue={true}
                    labelInValue
                    onBlur={this.onBlur.bind(this)}
                    loading={this.state.isLoading}
                    style={{ minWidth: "300px" }}
                    placeholder={<FormattedMessage id="selectUser" />}
                    notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                    filterOption={false}
                    onSearch={this._handleSearch}
                    onSelect={this.onChange.bind(this)}>
                    { this.props.showUnassigned && <Select.Option key={"null"} value={""}>Unassigned</Select.Option>}
                    {this.state.options && this.state.options.map(user => (
                        <Select.Option key={user.id} value={user.id.toString()}><UserDetails user={user} /></Select.Option>
                    ))}
                </ Select>
            );
        }
        else {
            if (this.state.currentUserId !== undefined || this.props.currentUserId) {
                return (<span onClick={this.onStartEdit.bind(this)}><UserDetails userId={this.state.currentUserId !== undefined ? this.state.currentUserId : this.props.currentUserId}></UserDetails></span>)
            }
            else {
                return (<span onClick={this.onStartEdit.bind(this)}>Unassigned</span>)
            }
        }
    }

    _handleSearch = async (query: string) => {
        this.setState({ isLoading: true });

        const users = await searchUsers(query, this.props.userType);
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