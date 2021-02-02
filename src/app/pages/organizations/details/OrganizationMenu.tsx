import * as React from "react";
import { Organization } from "../../../services/organizations";
import { Link } from "react-router-dom";
import { Layout, Menu, Badge } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { UnorderedListOutlined, TeamOutlined, PieChartOutlined, SettingOutlined, FlagOutlined, InboxOutlined } from '@ant-design/icons';
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import { User } from "app/services/users";
import { OrganizationTeamUser } from "app/services/organizationTeams";
import { canManageOrganization } from "app/services/authentication";
import { ApplicationState } from "app/store";
import StoreOrganizationShortcut from "app/store/shortcuts/StoreOrganizationShortcut";
import { connect } from "react-redux";
import { loadShortcutDocs } from "app/store/shortcuts/actions";
import { Dispatch } from "redux";
import { FormattedMessage } from "react-intl";
require("./style.scss")

interface OrganizationDetailsPageProps extends InjectableProps, DispatchProps {
    shortcuts?: OrganizationShortcut[];
    currentOrgPermission?: OrganizationTeamUser;
    currentUser?: User | undefined;
    organization: Organization;
    match: string;

}

interface DispatchProps {
    loadShortcutDocs(shortcutId: string, page: number): void;
}


interface InjectableProps {
    shortcutsMap: Map<string, StoreOrganizationShortcut>;
    showMilestones: boolean;
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

    forceReload(shortcutId: string) {
        this.props.loadShortcutDocs(shortcutId, 1);
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

                <Menu.Item icon={<InboxOutlined />} key="inbox">
                    <Link onDoubleClick={this.forceReload.bind(this, "inbox")} to={`/organizations/${organization.login}/inbox`}><Badge offset={[15, 0]} count={this.props.shortcutsMap.get("inbox")?.unreadDocs?.size}><FormattedMessage id="menuinboxText" /></Badge></Link>
                </Menu.Item>
                <Menu.Item icon={<InboxOutlined />} key="private">
                    <Link onDoubleClick={this.forceReload.bind(this, "private")} to={`/organizations/${organization.login}/private`}><Badge offset={[15, 0]} count={this.props.shortcutsMap.get("private")?.unreadDocs?.size}><FormattedMessage id="menuprivateText" /></Badge></Link>
                </Menu.Item>
                {this.props.shortcuts?.map((shortcut) => <Menu.Item className="ant-menu-item" icon={shortcut.star && <StarFilled />} key={shortcut.id}>
                    <Link className="ahora-shurtcut-link" onDoubleClick={this.forceReload.bind(this, shortcut.id!.toString())} to={`/organizations/${this.props.organization && this.props.organization.login}/${shortcut.id}`}><Badge offset={[15, 0]} count={this.props.shortcutsMap.get(shortcut.id!.toString())?.unreadDocs?.size}>{shortcut.title}</Badge></Link>
                </Menu.Item>
                )}
                <Menu.Item icon={<PieChartOutlined />} key="dashboards"><Link to={`/organizations/${organization.login}/dashboards`}><FormattedMessage id="menuDashboardsText" /></Link></Menu.Item>
                <Menu.Item icon={<UnorderedListOutlined />} key="docs"><Link onDoubleClick={this.forceReload.bind(this, "docs")} to={`/organizations/${organization.login}/docs`}><FormattedMessage id="menudocsText" /></Link></Menu.Item>
                <Menu.Item icon={<TeamOutlined />} key="teams"><Link to={`/organizations/${organization.login}/teams`}><FormattedMessage id="menuTeamsText" /></Link></Menu.Item>
                {this.props.showMilestones || canManageOrg && <Menu.Item icon={<FlagOutlined />} key="milestones"><Link to={`/organizations/${organization.login}/milestones`}><FormattedMessage id="menuMilestonesText" /></Link></Menu.Item>}
                {canManageOrg && <Menu.Item icon={<SettingOutlined />} key="settings"><Link to={`/organizations/${organization.login}/settings`}><FormattedMessage id="menuSettingsText" /></Link></Menu.Item>}
            </Menu>
        </Sider>
    }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        loadShortcutDocs: (shortcutdId: string, page: number) => dispatch(loadShortcutDocs(shortcutdId, page)),
    }
}

const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        shortcutsMap: state.shortcuts.map,
        showMilestones: state.milestones.milestones.length > 0,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationMenu as any);