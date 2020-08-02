import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default class DefaultDocsPage extends React.Component {
    render() {
        return <div className="defaultdoccontainer">
            <p>Start a discussion or just select your relevant doc!</p>
            <div>
                <Link to="add">
                    <Button type="primary">Start a new discussion</Button>
                </Link>
            </div>
        </div>;
    }
}