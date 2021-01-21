import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

interface PageParams {
    login: string;
    section: string;
}

interface Props extends RouteComponentProps<PageParams> {

}

export default class DefaultDocsPage extends React.Component<Props> {
    render() {
        return <div className="defaultdoccontainer">
            <p><FormattedMessage id="noDocSelectText" /></p>
            <div>
                <Link to={`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/add`}>
                    <Button type="primary"><FormattedMessage id="noDocSelectedButtonText" /></Button>
                </Link>
            </div>
        </div>;
    }
}