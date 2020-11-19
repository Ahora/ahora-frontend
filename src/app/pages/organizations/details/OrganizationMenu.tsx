import * as React from "react";
import { Organization } from "../../../services/organizations";
import { Link } from "react-router-dom";
import { Layout, Menu, Badge } from 'antd';
import { MessageOutlined, PlusCircleOutlined, StarFilled } from '@ant-design/icons';
import { UnorderedListOutlined, TeamOutlined, PieChartOutlined, SettingOutlined, FlagOutlined, InboxOutlined } from '@ant-design/icons';
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import SubMenu from "antd/lib/menu/SubMenu";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { User } from "app/services/users";
import { OrganizationTeamUser } from "app/services/organizationTeams";
import { canManageOrganization } from "app/services/authentication";
import { ApplicationState } from "app/store";
import StoreOrganizationShortcut from "app/store/shortcuts/StoreOrganizationShortcut";
import { connect } from "react-redux";
require("./style.scss")

interface OrganizationDetailsPageProps extends InjectableProps {
    shortcuts?: OrganizationShortcut[];
    currentOrgPermission?: OrganizationTeamUser;
    currentUser?: User | undefined;
    organization: Organization;
    match: string;

}

interface InjectableProps {
    shortcutsMap: Map<string, StoreOrganizationShortcut>;
}

interface OrganizationDetailsPageState {
    collapsed: boolean;
}

class OrganizationMenu extends React.Component<OrganizationDetailsPageProps, OrganizationDetailsPageState> {
    constructor(props: OrganizationDetailsPageProps) {
        super(props);

        this.state = {
            collapsed: false
        };
    }

    onCollapse(collapsed: boolean) {
        this.setState({ collapsed });
    };

    render() {
        const { Sider } = Layout;
        const canManageOrg: boolean = canManageOrganization(this.props.currentOrgPermission);
        const organization = this.props.organization;

        return <Sider theme="dark" breakpoint="sm" collapsedWidth="0" collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse.bind(this)}>
            <Menu
                theme="dark"
                mode="inline"
                defaultOpenKeys={["shortcuts"]}
                selectedKeys={[this.props.match || "dashboards"]}
                style={{ height: '100%' }}
            >
                {this.props.currentUser &&
                    <>
                        <Menu.Item icon={<InboxOutlined />} key="inbox">
                            <Link to={`/organizations/${organization.login}/inbox`}><Badge offset={[15, 0]} count={this.props.shortcutsMap.get("inbox")?.unreadDocs?.length}>Inbox</Badge></Link>
                        </Menu.Item>
                        <Menu.Item style={{ display: "none" }} icon={<MessageOutlined />}>
                            Shortcuts
                <Link className="ant-menu-submenu-plus" to={`/organizations/${this.props.organization.login}/shortcuts/add`}>
                                <PlusCircleOutlined />
                            </Link>
                        </Menu.Item>
                        {this.props.shortcuts ?
                            <SubMenu key={"shortcuts"} icon={<MessageOutlined />} title="shortcuts">
                                {this.props.shortcuts.map((shortcut) => <Menu.Item className="ant-menu-item" icon={shortcut.star && <StarFilled />} key={shortcut.id}>
                                    <Link to={`/organizations/${this.props.organization && this.props.organization.login}/${shortcut.id}`}><Badge offset={[15, 0]} count={this.props.shortcutsMap.get(shortcut.id!.toString())?.unreadDocs?.length}>{shortcut.title}</Badge></Link>
                                </Menu.Item>
                                )}
                                <Menu.Item key="shortcuts">
                                    <Link to={`/organizations/${this.props.organization.login}/shortcuts`}>Manage</Link>
                                </Menu.Item>
                            </SubMenu>

                            :
                            <Menu.Item key="loader"><AhoraSpinner /></Menu.Item>
                        }
                    </>
                }
                <Menu.Item icon={<PieChartOutlined />} key="dashboards"><Link to={`/organizations/${organization.login}/dashboards`}>Dashboards</Link></Menu.Item>
                <Menu.Item icon={<UnorderedListOutlined />} key="docs"><Link to={`/organizations/${organization.login}/docs`}>Browse</Link></Menu.Item>
                <Menu.Item icon={<TeamOutlined />} key="teams"><Link to={`/organizations/${organization.login}/teams`}>Teams</Link></Menu.Item>
                <Menu.Item icon={<FlagOutlined />} key="milestones"><Link to={`/organizations/${organization.login}/milestones`}>Milestones</Link></Menu.Item>
                {canManageOrg && <Menu.Item icon={<SettingOutlined />} key="settings"><Link to={`/organizations/${organization.login}/settings`}>Settings</Link></Menu.Item>}
            </Menu>
        </Sider>
    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return { shortcutsMap: state.shortcuts.map };
};

export default connect(mapStateToProps)(OrganizationMenu as any);