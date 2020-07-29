import * as React from "react";
import { UserItem, searchUsers } from "app/services/users";
import { Select } from "antd";
import AhoraSpinner from "../Forms/Basics/Spinner";
import UserDetails from "./UserDetails";
import { debounce } from "lodash";

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
            editMode: (this.props.editMode === undefined) ? true : this.props.editMode
        });
    }

    render() {
        if (this.state.editMode) {
            return (
                <Select
                    showSearch={true}
                    labelInValue
                    placeholder="Select users"
                    notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                    filterOption={false}
                    onSearch={this._handleSearch}
                    onSelect={this.onChange.bind(this)}
                    onChange={this._handleInputChange}>
                    {this.state.options.map(user => (
                        <Select.Option key={user.id} value={user.id!.toString()}><UserDetails user={user} /></Select.Option>
                    ))}
                </ Select>
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