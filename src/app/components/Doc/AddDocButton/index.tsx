import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CanAddDoc from "app/components/Authentication/CanAddDoc";
import AhoraHotKey from "app/components/Basics/AhoraHotKey";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

interface Props {
    login: string;
    section: string;
}

export default function AddDocButton(props: Props) {
    return <CanAddDoc>
        <AhoraHotKey shortcut="alt+n">
            <Link className="add-doc-button" to={`/organizations/${props.login}/${props.section}/add`}>
                <Button className="add-button" block type="primary">
                    <PlusOutlined />
                    <FormattedMessage id="addDiscussionButtonText" /></Button>
            </Link>
        </AhoraHotKey>
    </CanAddDoc>
}