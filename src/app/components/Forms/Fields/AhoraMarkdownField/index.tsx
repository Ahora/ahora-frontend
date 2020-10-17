import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Mentions } from 'antd';
import { UserItem, searchUsers } from 'app/services/users';
import { debounce } from 'lodash';
import FileUpload from 'app/components/FileUpload';

const { Option } = Mentions;


interface State {
    value: string;
    users?: UserItem[];
    loading: boolean;
    autoFocus: boolean;
}

interface Props {
    value?: string;
    autoFocus?: boolean;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


export default class AhoraMarkdownField extends React.Component<Props, State> {

    private mentionRef: React.RefObject<any>;

    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value || "",
            loading: false,
            autoFocus: false
        };
        this.mentionRef = React.createRef();
        this.onSearch = debounce(this.onSearch, 800);
    }

    public focus() {
        this.mentionRef.current.focus();
    }

    componentDidUpdate() {
        if (this.props.value === "" && this.state.value !== "") {
            this.setState({ value: "" });

            if (this.props.autoFocus) {
                this.setState({ autoFocus: true });
            }
        }
    }


    async onSearch(search: string) {
        if (search && search.length > 2) {
            this.setState({
                loading: true,
                users: undefined
            });

            const users = await searchUsers(search);

            this.setState({
                loading: false,
                users: users.slice(0, 10)
            });
        }
    }


    onChange(value: string) {
        this.setState({ value });
        this.props.onChange(value);
    }

    onFileUploaded(url: string) {
        this.setState({ value: this.state.value + "\n" + url });
    }

    render() {
        return (
            <>
                <Mentions ref={this.mentionRef} autoFocus={this.state.autoFocus} placeholder="Message" autoSize={true} rows={1} loading={this.state.loading} value={this.state.value} defaultValue={this.props.value} onChange={this.onChange.bind(this)} onSearch={this.onSearch.bind(this)}>
                    {this.state.users && this.state.users.map((user) => (
                        <Option key={user.username} value={user.username}>
                            <span>{user.username}</span>
                        </Option>
                    ))}
                </Mentions>
                <div style={{ display: "none" }}>
                    <FileUpload onFileUploaded={this.onFileUploaded.bind(this)}></FileUpload>
                </div>
            </>
        );
    }
}
