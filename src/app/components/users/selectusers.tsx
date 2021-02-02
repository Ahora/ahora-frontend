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
import { ApplicationState } from "app/store";

interface DispatchProps {
    addUsersToStore(users: UserItem[]): void;
}

interface InjectableProps {
    recentUsers: Set<number>
}

interface SelectUserProps extends DispatchProps, InjectableProps {
    onSelect(number: number | null): void;
    currentUserId?: number,
    editMode?: boolean;
    autoFocus?: boolean;
    userType?: UserType;
    showUnassigned?: boolean
}


interface State {
    isLoading: boolean,
    recentUsers?: number[];
    options: UserItem[],
    currentUserId: number | null | undefined;
    editMode: boolean;
    query: string;
}

class SelectUser extends React.Component<SelectUserProps, State> {

    constructor(props: SelectUserProps) {
        super(props);
        this.state = {
            currentUserId: undefined,
            isLoading: false,
            options: [],
            query: '',
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
            currentUserId: this.props.currentUserId,
            query: ""
        });
    }

    onChange(user: any) {
        let userId: number | null = null
        if (user.value !== "") {
            userId = user.value;
        }
        if (userId !== this.state.currentUserId) {
            this.props.onSelect(userId);
        }

        this.setState({
            editMode: this.props.editMode || false,
            currentUserId: userId
        });
    }

    dropDownChanged() {
        this.setState({ recentUsers: [...this.props.recentUsers].reverse() })
    }

    render() {
        if (this.state.editMode) {
            return (
                <Select
                    defaultOpen={true}
                    autoFocus={this.props.autoFocus}
                    showSearch={true}
                    onFocus={this.dropDownChanged.bind(this)}
                    autoClearSearchValue={true}
                    labelInValue
                    onBlur={this.onBlur.bind(this)}
                    loading={this.state.isLoading}
                    style={{ minWidth: "300px" }}
                    onDropdownVisibleChange={this.dropDownChanged.bind(this)}
                    placeholder={<FormattedMessage id="selectUser" />}
                    notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                    filterOption={false}
                    onSearch={this._handleSearch}
                    onSelect={this.onChange.bind(this)}>
                    { this.props.showUnassigned && <Select.Option key={"null"} value={""}><FormattedMessage id="unassigned" /></Select.Option>}
                    {(this.state.recentUsers && this.state.query.length === 0 && this.state.recentUsers.length > 0) &&
                        <Select.OptGroup label={<FormattedMessage id="recentUsers" />}>
                            {this.state.recentUsers.map((userId) => <Select.Option key={userId} value={userId}><UserDetails userId={userId} /></Select.Option>)}
                        </Select.OptGroup>
                    }
                    {(this.state.query.length > 0) &&
                        <Select.OptGroup label={<FormattedMessage id="usersSearchResults" />} >
                            {this.state.options.map(user => (
                                <Select.Option key={user.id} value={user.id}><UserDetails user={user} /></Select.Option>
                            ))}
                        </Select.OptGroup>
                    }

                </ Select>
            );
        }
        else {
            if (this.state.currentUserId !== undefined || this.props.currentUserId) {
                return (<span onClick={this.onStartEdit.bind(this)}><UserDetails userId={this.state.currentUserId !== undefined ? this.state.currentUserId : this.props.currentUserId}></UserDetails></span>)
            }
            else {
                return (<span onClick={this.onStartEdit.bind(this)}><FormattedMessage id="unassigned" /></span>)
            }
        }
    }

    _handleSearch = async (query: string) => {
        this.setState({ isLoading: true, query });

        const users = await searchUsers(query, this.props.userType);
        this.props.addUsersToStore(users);
        this.setState({
            isLoading: false,
            options: users
        });
    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        recentUsers: state.users.recentUsers
    }
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addUsersToStore: (users: UserItem[]) => dispatch(addUsersToState(users))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUser as any); 