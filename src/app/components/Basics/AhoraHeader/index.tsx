import { InboxOutlined, MenuOutlined } from "@ant-design/icons";
import { Badge, Button, Drawer, Space } from "antd";
import CurrentUser from "app/components/CurrentUser";
import OrganizationMenu from "app/pages/organizations/details/OrganizationMenu";
import { Organization } from "app/services/organizations";
import { ApplicationState } from "app/store";
import * as React from "react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";

interface InjectableProps {
    organization?: Organization,
    unReadCount?: number

}

interface Props extends InjectableProps {
}


function AhoraHeader(props: Props) {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };

    let location = useLocation()

    useEffect(() => { setVisible(false); }, [location])

    const onClose = () => {
        setVisible(false);
    };
    return <>
        <Drawer
            closable={true}
            closeIcon
            placement="left"
            onClose={onClose}
            destroyOnClose={true}
            visible={visible}>
            <OrganizationMenu></OrganizationMenu>
        </Drawer>
        <div className="logocontainer">
            <Space>
                {isMobile &&
                    <MenuOutlined onClick={showDrawer} />
                }
                <div className="logo" style={{ width: "80px" }}>
                    <Link to="/"><img src="/images/logo.svg" /></Link>
                </div>
            </Space>
        </div>
        <div className="rightside">
            <CurrentUser></CurrentUser>
            {props.organization &&
                <Link title="Inbox" to={`/organizations/${props.organization.login}/inbox`}>
                    <Badge count={props.unReadCount}>
                        <Button type="text" style={{ color: "#000000" }} icon={<InboxOutlined></InboxOutlined>} />
                    </Badge>
                </Link>}
        </div></>;
}


const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        organization: state.organizations.currentOrganization,
        unReadCount: state.shortcuts.map.get("inbox")?.unreadDocs?.size
    };
};

export default connect(mapStateToProps, null)(AhoraHeader as any);
