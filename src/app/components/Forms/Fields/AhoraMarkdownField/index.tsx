import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Mentions } from 'antd';
import { searchUsers, UserItem } from 'app/services/users';
import { debounce } from 'lodash';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { addUsersToState, updateUserUsedInState } from 'app/store/users/actions';
import { connect } from 'react-redux';
import UserDetails from 'app/components/users/UserDetails';

const { Option } = Mentions;

interface InjectableProps {
    recentUsers: Set<number>,
    usersMap: Map<number, UserItem>
}
interface DispatchProps {
    userUsed(id: number): void;
    addUsersToStore(users: UserItem[]): void;
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
    onChange?: (value: string) => void;
    onPressEnter: () => void;
}


class AhoraMarkdownField extends React.Component<Props, State> {

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
            this.props.addUsersToStore(users);
            this.setState({
                loading: false,
                users: users.slice(0, 10)
            });
        }
        else {
            const possibleUsers = [...this.props.recentUsers].reverse();
            const users = possibleUsers.map((userId) => this.props.usersMap.get(userId)!)
            this.setState({
                users
            });
        }
    }


    onChange(value: string) {
        this.setState({ value });
        if (this.props.onChange)
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
            <Mentions
                ref={this.mentionRef}
                autoFocus={this.state.autoFocus}
                autoSize={true}
                value={this.props.value}
                loading={this.state.loading}
                defaultValue={this.props.value}
                onPressEnter={this.props.onPressEnter && this.props.onPressEnter.bind(this)}
                onSelect={this.onUserSelect.bind(this)}
                onChange={this.onChange.bind(this)}
                onSearch={this.onSearch.bind(this)}>
                {this.state.users && this.state.users.map((user) => (
                    <Option key={user.id.toString()} value={user.username}>
                        <UserDetails userId={user.id} user={user}></UserDetails>
                    </Option>
                ))}
            </Mentions>
        );
    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        recentUsers: state.users.recentUsers,
        usersMap: state.users.map
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {

    return {
        userUsed: (id: number) => dispatch(updateUserUsedInState(id)),
        addUsersToStore: (users: UserItem[]) => dispatch(addUsersToState(users)),
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AhoraMarkdownField as any)