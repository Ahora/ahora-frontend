import * as React from 'react';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { getDocSources, DocSource, deleteDocSource, syncNowDocSource } from 'app/services/docSources';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { Link } from 'react-router-dom';
import { AddDocSourceForm } from 'app/components/DocSources/AddDocSourceForm';
import { Button, Table, Popconfirm, Menu, Space } from 'antd';
import AhoraDate from 'app/components/DatesTimes/Time';

interface MilestonesPageState {
    form?: any;
    docSources?: DocSource[];
}

interface MilestonesPageParams {
    organizationId: string;
}

interface MilestonesPageProps extends MilestonesPageParams {

}

class DocSourcesPage extends React.Component<MilestonesPageProps, MilestonesPageState> {
    constructor(props: MilestonesPageProps) {
        super(props);
        this.state = {};
    }

    async docSourceAdded(addedDocSource: DocSource) {
        this.setState({
            docSources: [addedDocSource, ...this.state.docSources || []]
        });
    }

    async componentDidMount() {
        const docSources = await getDocSources();
        this.setState({
            docSources
        });
    }

    public openAddForm() {
        this.setState({
            form: {}
        });
    }

    cancelAdd() {
        this.setState({
            form: undefined
        });
    }

    async syncNow(docSource: DocSource) {
        await syncNowDocSource(docSource.id!);

        if (this.state.docSources) {
            this.setState({
                docSources: this.state.docSources.map((source) => source.id === docSource.id ? { ...docSource, syncing: true } : source)
            })
        }
    }




    async deleteSource(docSource: DocSource) {
        await deleteDocSource(docSource.id!);

        if (this.state.docSources) {
            this.setState({
                docSources: this.state.docSources.filter((source) => source.id !== docSource.id)
            })
        }
    }

    render() {
        return (
            <div>
                <CanManageOrganization>
                    {this.state.form ?
                        <div className="wrap-content">
                            <AddDocSourceForm onDocSourceAdded={this.docSourceAdded.bind(this)}></AddDocSourceForm>
                        </div>
                        :
                        <Menu className="navbar-menu" mode="horizontal">
                            <Space>
                                <Button onClick={this.openAddForm.bind(this)}>Add external source</Button>
                            </Space>
                        </Menu>
                    }
                </CanManageOrganization>

                {this.state.docSources ?
                    <Table pagination={{ pageSize: 50 }} className="content-toside" dataSource={this.state.docSources} rowKey="id">
                        <Table.Column title="Repo" dataIndex="repo" key="repo" render={(repo: string, docSource: DocSource) =>
                            <Link to={`/organizations/${this.props.organizationId}/docs?repo=${docSource.repo}`}>{docSource.repo}</Link>
                        } />
                        <Table.Column title="Organization/User" dataIndex="organization" key="organization" />
                        <Table.Column title="Last Updated" dataIndex="lastUpdated" key="lastUpdated" render={(lastUpdated?: Date) =>
                            <>{lastUpdated && <AhoraDate date={lastUpdated}></AhoraDate>}</>
                        } />
                        <Table.Column title="Syncing" dataIndex="syncing" key="syncing" render={(syncing?: boolean) =>
                            <>{syncing!.toString()}</>
                        } />
                        <Table.Column title="Actions" render={(value, docSource: DocSource) =>
                            <CanManageOrganization>
                                <Space>
                                    <Popconfirm onConfirm={this.deleteSource.bind(this, docSource)} title="Are you sure?">
                                        <Button danger>Delete</Button>
                                    </Popconfirm>
                                    {docSource.syncing === false &&
                                        <Button type="primary" onClick={this.syncNow.bind(this, docSource)}>Sync now</Button>
                                    }
                                </Space>
                            </CanManageOrganization>
                        } />
                    </Table>
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): MilestonesPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
    };
};


export default connect(mapStateToProps, null)(DocSourcesPage as any); 
