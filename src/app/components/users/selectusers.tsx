import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as React from "react";
import { UserItem, searchUsers } from "app/services/users";

interface SelectUserProps {
    onSelect(user: UserItem): void;
    defaultSelected?: UserItem[]
    editMode?: boolean;
}
interface State {
    isLoading: boolean,
    options: UserItem[],
    query: string;
    editMode: boolean;
}

export default class SelectUser extends React.Component<SelectUserProps, State> {

    constructor(props: SelectUserProps) {
        super(props);
        this.state = {
            isLoading: false,
            options: [],
            query: '',
            editMode: (props.editMode === undefined) ? true : props.editMode
        };
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

    onChange(users: UserItem[]) {
        if (users.length > 0) {
            this.props.onSelect(users[0]);
            this.setState({
                editMode: (this.props.editMode === undefined) ? true : this.props.editMode
            });
        }
    }

    render() {
        if (this.state.editMode) {
            return (
                <AsyncTypeahead
                    labelKey="username"
                    maxResults={50 - 1}
                    {...this.state}
                    onBlur={this.onBlur.bind(this)}
                    onChange={(users) => { this.onChange(users) }}
                    onInputChange={this._handleInputChange.bind(this)}
                    onSearch={this._handleSearch.bind(this)}
                    defaultSelected={this.props.defaultSelected}
                    placeholder="Search for a user..."
                    renderMenuItemChildren={
                        (user: UserItem) => {
                            return <div key={user.id}>{user.displayName} ({user.username})</div>;
                        }
                    }
                />
            );
        }
        else {
            if (this.props.defaultSelected && this.props.defaultSelected.length > 0) {
                return (<span onClick={this.onStartEdit.bind(this)}>{this.props.defaultSelected[0].displayName} ({this.props.defaultSelected[0].username})</span>)
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
        this.setState({
            isLoading: false,
            options: users,
        });
    }
}