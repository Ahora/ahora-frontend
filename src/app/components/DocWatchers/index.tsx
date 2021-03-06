import * as React from 'react';
import { DocWatcher, getWatchers } from 'app/services/watchers';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { watchDoc, unwatchDoc } from 'app/services/docs';
import AhoraSpinner from '../Forms/Basics/Spinner';
import { Button } from 'antd';

interface injectedParams {
    currentUser?: User,
}


interface DocWatcherProps extends injectedParams {
    docId: number;
    login: string;
}

interface State {
    isWatchedByMe: boolean,
    watchers?: DocWatcher[];
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

            const myWatch: DocWatcher = await watchDoc(this.props.login, this.props.docId);
            myWatch.watcher = {
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
                watchers: this.state.watchers.filter((watcher) => { watcher.userId !== this.props.currentUser!.id })
            });
        }
    }

    async componentDidMount() {
        const watchers: DocWatcher[] = await getWatchers(this.props.login, this.props.docId);

        if (this.props.currentUser) {
            let isWatchedByMe: boolean = false;
            const myWatch: DocWatcher[] | null = watchers.filter((watcher) => watcher.userId === this.props.currentUser!.id)
            isWatchedByMe = (myWatch.length > 0);

            this.setState({
                watchers,
                isWatchedByMe
            });
        } else {
            this.setState({ watchers });
        }
    }

    render() {
        return (
            <div>
                {this.state.watchers ?
                    (<>
                        {this.props.currentUser &&
                            <div>
                                {this.state.isWatchedByMe ?
                                    <Button type="primary" onClick={this.unwatch.bind(this)}>Unwatch</Button> :
                                    <Button type="primary" onClick={this.watch.bind(this)}>Watch</Button>
                                }
                            </div>
                        }

                        {this.state.watchers.length > 0 &&
                            <div className="list mt-2">
                                {this.state.watchers.map((watcher) => {
                                    return (<div key={watcher.id}><i className="fas fa-user mr-2"></i>{watcher.watcher.displayName || watcher.watcher.username}</div>);
                                })}
                            </div>
                        }
                    </>) :
                    (<AhoraSpinner />)
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

export default connect(mapStateToProps)(DocWatchersComponent as any);