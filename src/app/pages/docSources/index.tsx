import * as React from 'react';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import Moment from 'react-moment';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { getDocSources, DocSource, deleteDocSource } from 'app/services/docSources';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { Link } from 'react-router-dom';
import { AddDocSourceForm } from 'app/components/DocSources/AddDocSourceForm';
import Button from 'react-bootstrap/Button';

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
                    <Table>
                        <thead>
                            <tr>
                                <th>Repo</th>
                                <th>Organization/User</th>
                                <th>Last Updated</th>
                                <th>Syncing</th>
                                <CanManageOrganization>
                                    <th></th>
                                </CanManageOrganization>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.docSources.map((docSource: DocSource,) => {
                                return (
                                    <tr className="pt-3" key={docSource.id}>
                                        <td>
                                            <Link to={`/organizations/${this.props.organizationId}/docs?repo=${docSource.repo}`}>{docSource.repo}</Link>
                                        </td>
                                        <td>{docSource.organization}</td>
                                        <td>{docSource.lastUpdated && <Moment date={docSource.lastUpdated} format="D MMM YYYY hh:mm"></Moment>}</td>
                                        <td>{docSource.syncing!.toString()}</td>
                                        <CanManageOrganization>
                                            <td>
                                                <Button variant="danger" onClick={() => { this.deleteSource(docSource) }}>Delete</Button>
                                            </td>
                                        </CanManageOrganization>
                                    </tr>);
                            })}
                        </tbody>
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
