import { Typography } from 'antd';
import * as React from 'react';

export default class LoginPage extends React.Component {
    render() {
        return (
            <div className="wrap-content">
                <Typography.Title>Choose login provider</Typography.Title>

                <ul>
                    <li><a href="/auth/github">Github</a></li>
                    <li><a href="/auth/google">Google</a></li>
                </ul>
            </div>
        );
    };
}