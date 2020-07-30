import * as React from 'react';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import Moment from 'react-moment';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { getDocSources, DocSource, deleteDocSource } from 'app/services/docSources';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { Link } from 'react-router-dom';
import { AddDocSourceForm } from 'app/components/DocSources/AddDocSourceForm';
import { Button, Table } from 'antd';

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
                        <AddDocSourceForm onDocSourceAdded={this.docSourceAdded.bind(this)}></AddDocSourceForm>
                        :
                        <Button onClick={this.openAddForm.bind(this)}>Add docSource</Button>
                    }
                </CanManageOrganization>

                {this.state.docSources ?
                    <Table pagination={{ pageSize: 50 }} className="content-toside" dataSource={this.state.docSources} rowKey="id">
                        <Table.Column title="Repo" dataIndex="repo" key="repo" render={(repo: string, docSource: DocSource) =>
                            <Link to={`/organizations/${this.props.organizationId}/docs?repo=${docSource.repo}`}>{docSource.repo}</Link>
                        } />
                        <Table.Column title="Organization/User" dataIndex="organization" key="organization" />
                        <Table.Column title="Last Updated" dataIndex="lastUpdated" key="lastUpdated" render={(lastUpdated?: Date) =>
                            <>{lastUpdated && <Moment date={lastUpdated} format="D MMM YYYY hh:mm"></Moment>}</>
                        } />
                        <Table.Column title="Last Updated" dataIndex="syncing" key="syncing" render={(syncing?: boolean) =>
                            <>{syncing!.toString()}</>
                        } />
                        <Table.Column title="Actions" render={(value, docSource: DocSource) =>
                            <CanManageOrganization>
                                <Button danger onClick={() => { this.deleteSource(docSource) }}>Delete</Button>
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
