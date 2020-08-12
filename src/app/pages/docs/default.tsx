import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';

interface PageParams {
    login: string;
}

interface Props extends RouteComponentProps<PageParams> {

}

export default class DefaultDocsPage extends React.Component<Props> {
    render() {
        return <div className="defaultdoccontainer">
            <p>Start a discussion or just select your relevant doc!</p>
            <div>
                <Link to={`/organizations/${this.props.match.params.login}/docs/add`}>
                    <Button type="primary">Start a new discussion</Button>
                </Link>
            </div>
        </div>;
    }
}