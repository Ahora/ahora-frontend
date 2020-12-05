import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Mentions } from 'antd';
import { UserItem, searchUsers } from 'app/services/users';
import { debounce } from 'lodash';
import FileUpload from 'app/components/FileUpload';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { updateUserUsedInState } from 'app/store/users/actions';
import { connect } from 'react-redux';

const { Option } = Mentions;

interface InjectableProps {
    recentUsers: Set<number>
}
interface DispatchProps {
    userUsed(id: number): void;
}

interface State {
    value?: string;
    users?: UserItem[];
    loading: boolean;
    autoFocus: boolean;
}

interface Props extends DispatchProps, InjectableProps {
    value?: string;
    autoFocus?: boolean;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


export class AhoraMarkdownField extends React.Component<Props, State> {

    private mentionRef: React.RefObject<any>;

    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value,
            loading: false,
            autoFocus: false
        };
        this.mentionRef = React.createRef();
        this.onSearch = debounce(this.onSearch, 800);
    }

    public focus() {
        this.mentionRef.current.focus();
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

    onUserSelect(option: any, prefix: string) {
        this.props.userUsed(parseInt(option.key));
    }

    render() {
        return (
            <>
                <Mentions
                    ref={this.mentionRef}
                    autoFocus={this.state.autoFocus}
                    placeholder="Message" autoSize={true}
                    rows={1} loading={this.state.loading}
                    value={this.props.value}
                    defaultValue={this.props.value}
                    onSelect={this.onUserSelect.bind(this)}
                    onChange={this.onChange.bind(this)}
                    onSearch={this.onSearch.bind(this)}>
                    {this.state.users && this.state.users.map((user) => (
                        <Option key={user.id.toString()} value={user.username}>
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

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        recentUsers: state.users.recentUsers
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {

    return {
        userUsed: (id: number) => dispatch(updateUserUsedInState(id))
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AhoraMarkdownField as any)