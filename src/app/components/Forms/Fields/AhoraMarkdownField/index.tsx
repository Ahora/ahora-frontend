import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Mentions } from 'antd';
import { UserItem, searchUsers } from 'app/services/users';
import { debounce } from 'lodash';

const { Option } = Mentions;


interface State {
    value: string;
    users: UserItem[];
    loading: boolean;
}

interface Props {
    value?: string;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


export default class AhoraMarkdownField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value || "",
            loading: false,
            users: []
        };

        this.onSearch = debounce(this.onSearch, 800);

    }

    async onSearch(search: string) {
        this.setState({
            loading: true,
            users: []
        });

        const users = await searchUsers(search);

        this.setState({
            loading: false,
            users: users.slice(0, 10)
        });
    }


    onChange(value: string) {
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <Mentions rows={6} loading={this.state.loading} defaultValue={this.props.value} onChange={this.onChange.bind(this)} onSearch={this.onSearch.bind(this)}>
                {this.state.users.map((user) => (
                    <Option key={user.username} value={user.username}>
                        <span>{user.username}</span>
                    </Option>
                ))}
            </Mentions>
        );
    }
}
