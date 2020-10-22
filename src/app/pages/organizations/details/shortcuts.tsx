import * as React from "react";
import { Organization } from "../../../services/organizations";
import { connect } from "react-redux";
import { ApplicationState } from "app/store";
import { Link } from "react-router-dom";

import { Badge, Menu } from 'antd';
import { MessageOutlined, PlusCircleOutlined, StarFilled } from '@ant-design/icons';
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import SubMenu from "antd/lib/menu/SubMenu";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { getDocUnreadMessage } from "app/services/docs";
require("./style.scss")

interface InjectableProps {
    organization: Organization;
}

interface OrganizationDetailsPageProps extends InjectableProps {
    shortcuts?: OrganizationShortcut[];
    loading: boolean;

}

interface OrganizationDetailsPageState {
    unread: Map<number, number>;

}

class ShortcutMenuItem extends React.Component<OrganizationDetailsPageProps, OrganizationDetailsPageState> {
    constructor(props: OrganizationDetailsPageProps) {
        super(props);

        this.state = {
            unread: new Map()
        };
    }

    componentDidMount() {

        if (this.props.shortcuts) {
            this.props.shortcuts.forEach(async (shortcut) => {
                const unRead = await getDocUnreadMessage(shortcut.searchCriteria);
                this.setState({
                    unread: new Map(this.state.unread.set(shortcut.id!, unRead.length))
                })
            });
        }
    }

    componentDidUpdate(prevProps: OrganizationDetailsPageProps) {
        if (this.props.shortcuts !== prevProps.shortcuts) {
            this.componentDidMount();
        }
    }


    render() {
        return <Menu
            theme="dark"
            mode="inline"
            className="shortcuts"
            defaultOpenKeys={["shortcuts"]}>
            <Menu.Item icon={<MessageOutlined />}>
                Shortcuts
                <Link className="ant-menu-submenu-plus" to={`/organizations/${this.props.organization.login}/shortcuts/add`}>
                    <PlusCircleOutlined />
                </Link>
            </Menu.Item>
            {this.props.shortcuts ?
                <SubMenu key={"shortcuts"}>
                    {this.props.shortcuts.map((shortcut) => <Menu.Item className="ant-menu-item" icon={shortcut.star && <StarFilled />} key={shortcut.id}>
                        <Link to={`/organizations/${this.props.organization && this.props.organization.login}/${shortcut.id}`}><Badge offset={[15, 0]} count={this.state.unread.get(shortcut.id!)}>{shortcut.title}</Badge></Link>
                    </Menu.Item>
                    )}
                    <Menu.Item key="shortcuts">
                        <Link to={`/organizations/${this.props.organization.login}/shortcuts`}>Manage</Link>
                    </Menu.Item>
                </SubMenu>

                :
                <Menu.Item key="loader"><AhoraSpinner /></Menu.Item>
            }
        </Menu>

    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        organization: state.organizations.currentOrganization!
    };
};


export default connect(mapStateToProps)(ShortcutMenuItem as any);