import * as React from 'react';
import { OrganizationShortcut, deleteShortcut, updateShortcut } from 'app/services/OrganizationShortcut';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { ApplicationState } from 'app/store';
import { deleteShortcutFromState, updateShortcutToState } from 'app/store/shortcuts/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, Table, Space, Menu, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { SearchCriteriasDisplay } from 'app/components/SearchDocsInput/SearchCriteriasDisplay';
import { FormattedMessage } from 'react-intl';

interface ShortcutsPageState {
    form?: any;
}

interface ShortcutsPageParams {
    shortcuts?: OrganizationShortcut[];
    organizationId: string;
}

interface DispatchProps {
    updateShortcutToState(shortcut: OrganizationShortcut): void,
    removeShortcutFromState(id: number): void
}


interface ShortcutsPageProps extends ShortcutsPageParams, DispatchProps {

}

class ShortcutsPage extends React.Component<ShortcutsPageProps, ShortcutsPageState> {
    constructor(props: ShortcutsPageProps) {
        super(props);
        this.state = {

        }
    }

    async ondeleteShortcut(shortcut: OrganizationShortcut) {
        await deleteShortcut(shortcut.id!.toString());
        this.props.removeShortcutFromState(shortcut.id!);
    }

    async clearNotifications(shortcut: OrganizationShortcut) {
        const shortCutToUpdate = { ...shortcut, since: new Date() }
        const updatedShortcut = await updateShortcut(shortCutToUpdate.id!, shortCutToUpdate);
        this.props.updateShortcutToState(updatedShortcut);
    }

    render() {
        return (
            <div>

                <Menu className="navbar-menu" mode="horizontal">
                    <Space>
                        <Link className="ant-menu-submenu-plus" to={`/organizations/${this.props.organizationId}/shortcuts/add`}>
                            <Button><FormattedMessage id="shortcutAddButtonText" /></Button>
                        </Link>
                    </Space>
                </Menu>
                {(this.props.shortcuts) ?
                    <Table dataSource={this.props.shortcuts} rowKey="id">
                        <Table.Column dataIndex="star" key="star" render={(val: boolean) => val && <StarFilled />} />
                        <Table.Column title={<FormattedMessage id="shortcutTableTitle" />} dataIndex="title" key="title" />
                        <Table.Column title={<FormattedMessage id="shortcutTableSearchCriteria" />} dataIndex="searchCriteria" key="searchCriteria" render={(val: SearchCriterias) => val && <SearchCriteriasDisplay searchCriterias={val} />} />
                        <Table.Column title={<FormattedMessage id="shortcutTableActions" />} render={(value: any, shortcut: OrganizationShortcut) =>
                            <Space>
                                <Popconfirm onConfirm={this.ondeleteShortcut.bind(this, shortcut)} title="Are you sure?">
                                    <Button danger><FormattedMessage id="shortcutTableDeleteButtonText" /></Button>
                                </Popconfirm>
                                <Popconfirm onConfirm={this.clearNotifications.bind(this, shortcut)} title="Are you sure?">
                                    <Button><FormattedMessage id="shortcutTableClearNotificationsText" /></Button>
                                </Popconfirm>
                            </Space>
                        }></Table.Column>
                    </Table >
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): ShortcutsPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
        shortcuts: state.shortcuts.shortcuts
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        removeShortcutFromState: (id: number) => { dispatch(deleteShortcutFromState(id.toString())) },
        updateShortcutToState: (status: OrganizationShortcut) => { dispatch(updateShortcutToState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutsPage as any); 
