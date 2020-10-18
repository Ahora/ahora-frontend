import * as React from 'react';
import { OrganizationShortcut, deleteShortcut } from 'app/services/OrganizationShortcut';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { ApplicationState } from 'app/store';
import { requestShortcutsData, deleteShortcutFromState, updateShortcutToState } from 'app/store/shortcuts/actions';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, Table, Space, Menu, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { SearchCriteriasDisplay } from 'app/components/SearchDocsInput/SearchCriteriasDisplay';

interface ShortcutsPageState {
    form?: any;
}

interface ShortcutsPageParams {
    shortcuts?: OrganizationShortcut[];
    organizationId: string;
}

interface DispatchProps {
    requestShortcutData(): void;
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

    async componentDidMount() {
        this.props.requestShortcutData();
    }

    async ondeleteShortcut(shortcut: OrganizationShortcut) {
        await deleteShortcut(shortcut.id!);
        this.props.removeShortcutFromState(shortcut.id!);
    }

    render() {
        return (
            <div>

                <Menu className="navbar-menu" mode="horizontal">
                    <Space>
                        <Link className="ant-menu-submenu-plus" to={`/organizations/${this.props.organizationId}/shortcuts/add`}>
                            <Button>Add shortcut</Button>
                        </Link>
                    </Space>
                </Menu>
                {(this.props.shortcuts) ?
                    <Table dataSource={this.props.shortcuts} rowKey="id">
                        <Table.Column title="Star" dataIndex="star" key="star" render={(val: boolean) => val && <StarFilled />} />
                        <Table.Column title="Title" dataIndex="title" key="title" />
                        <Table.Column title="Search Criteria" dataIndex="searchCriteria" key="searchCriteria" render={(val: SearchCriterias) => val && <SearchCriteriasDisplay searchCriterias={val} />} />
                        <Table.Column title="Actions" render={(value: any, shortcut: OrganizationShortcut) =>
                            <CanManageOrganization>
                                <Space>
                                    <Popconfirm onConfirm={this.ondeleteShortcut.bind(this, shortcut)} title="Are you sure?">
                                        <Button danger>Delete</Button>
                                    </Popconfirm>
                                </Space>
                            </CanManageOrganization>
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
        requestShortcutData: () => dispatch(requestShortcutsData()),
        removeShortcutFromState: (id: number) => { dispatch(deleteShortcutFromState(id)) },
        updateShortcutToState: (status: OrganizationShortcut) => { dispatch(updateShortcutToState(status)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutsPage as any); 
