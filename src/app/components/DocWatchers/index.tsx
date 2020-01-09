import * as React from 'react';
import { DocWatchers, getWatchers } from 'app/services/watchers';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { Dispatch } from 'redux';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import Button from 'react-bootstrap/Button';
import { watchDoc, unwatchDoc } from 'app/services/docs';

interface injectedParams {
    currentUser: User | undefined,
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface DocWatcherProps extends injectedParams, DispatchProps {
    docId: number;
    login: string;
}

interface State {
    isWatchedByMe: boolean,
    watchers?: DocWatchers[];
}

class DocWatchersComponent extends React.Component<DocWatcherProps, State> {
    constructor(props: DocWatcherProps) {
        super(props);

        this.state = {
            watchers: undefined,
            isWatchedByMe: false
        }
    }

    async watch() {
        if (this.props.currentUser) {

            const myWatch: DocWatchers = await watchDoc(this.props.login, this.props.docId);
            myWatch.user = {
                username: this.props.currentUser.username,
                displayName: this.props.currentUser.displayName
            }

            this.setState({
                isWatchedByMe: true,
                watchers: [...this.state.watchers!, myWatch]
            });
        }
    }

    async unwatch() {
        if (this.props.currentUser && this.state.watchers) {
            unwatchDoc(this.props.login, this.props.docId);
            this.setState({
                isWatchedByMe: false,
                watchers: this.state.watchers.filter((watcher) => { watcher.userId === this.props.currentUser?.id })
            });
        }
    }

    async componentDidMount() {
        const watchers: DocWatchers[] = await getWatchers(this.props.login, this.props.docId);

        let isWatchedByMe: boolean = false;
        const myWatch: DocWatchers[] | null = watchers.filter((watcher) => watcher.userId === this.props.currentUser?.id)
        isWatchedByMe = (myWatch.length > 0);

        this.setState({
            watchers,
            isWatchedByMe
        });
    }

    render() {
        return (
            <div>
                {this.state.watchers ?
                    (<>
                        {this.props.currentUser &&
                            <div>
                                {this.state.isWatchedByMe ?
                                    <Button variant="primary" onClick={this.unwatch.bind(this)}>Unwatch</Button> :
                                    <Button variant="primary" onClick={this.watch.bind(this)}>Watch</Button>
                                }
                            </div>
                        }

                        {this.state.watchers.length > 0 &&
                            <div className="list">
                                {this.state.watchers.map((watcher) => {
                                    return (<div key={watcher.id}><i className="fas fa-user mr-2"></i>{watcher.user.username}</div>);
                                })}
                            </div>
                        }
                    </>) :
                    (<div className="text-center"><Spinner animation="border" variant="primary" /></div>)
                }
            </div>
        );
    }
}


const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        currentUser: state.currentUser.user
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DocWatchersComponent as any); 