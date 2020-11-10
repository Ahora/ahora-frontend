import * as React from "react";
import { Organization } from "../../../services/organizations";
import { Link } from "react-router-dom";
import { Layout, Menu, Badge } from 'antd';
import { MessageOutlined, PlusCircleOutlined, StarFilled } from '@ant-design/icons';
import { UnorderedListOutlined, TeamOutlined, PieChartOutlined, SettingOutlined, FlagOutlined, InboxOutlined } from '@ant-design/icons';
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import SubMenu from "antd/lib/menu/SubMenu";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { getDocUnreadMessage } from "app/services/docs";
import { User } from "app/services/users";
import { OrganizationTeamUser } from "app/services/organizationTeams";
import { canManageOrganization } from "app/services/authentication";
require("./style.scss")

interface OrganizationDetailsPageProps {
    shortcuts?: OrganizationShortcut[];
    currentOrgPermission?: OrganizationTeamUser;
    currentUser?: User | undefined;
    organization: Organization;
    match: string;

}

interface OrganizationDetailsPageState {
    unread: Map<number, number>;
    collapsed: boolean;
}

export default class OrganizationMenu extends React.Component<OrganizationDetailsPageProps, OrganizationDetailsPageState> {
    constructor(props: OrganizationDetailsPageProps) {
        super(props);

        this.state = {
            collapsed: false,
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

    onCollapse(collapsed: boolean) {
        this.setState({ collapsed });
    };

    componentDidUpdate(prevProps: OrganizationDetailsPageProps) {
        if (this.props.shortcuts !== prevProps.shortcuts) {
            this.componentDidMount();
        }
    }


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
                            <Link to={`/organizations/${organization.login}/inbox`}><Badge offset={[15, 0]} count={1}>Inbox</Badge></Link>
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