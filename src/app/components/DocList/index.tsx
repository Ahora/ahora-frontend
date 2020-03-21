import * as React from 'react';
import { Doc, getDocs } from 'app/services/docs';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import { requestStatusesData } from 'app/store/statuses/actions';
import Moment from 'react-moment';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { DocType } from 'app/services/docTypes';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import LabelsList from 'app/components/LabelsSelector/details';
import { Organization } from 'app/services/organizations';

interface DocsPageState {
    docs: Doc[] | null;
}

interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    loading: boolean;
    currentOrganization: Organization | undefined,
}

interface DocsPageProps extends injectedParams {
    searchCriteria: SearchCriterias;
}


interface DispatchProps {
    requestStatusesData(): void;
    requestDocTypes(): void;
}

interface AllProps extends DocsPageProps, DispatchProps {

}

class DocList extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            docs: null
        }
    }

    async loadData(searchCriteria: SearchCriterias) {
        this.setState({
            docs: null
        });
        const docs: Doc[] = await getDocs(searchCriteria);
        this.setState({
            docs
        });
    }

    componentWillReceiveProps(nextProps: DocsPageProps) {
        if (nextProps.searchCriteria !== this.props.searchCriteria) {
            this.loadData(nextProps.searchCriteria);
        }
    }

    async componentDidMount() {
        this.props.requestStatusesData();
        this.props.requestDocTypes();
        //this.loadData(this.props.searchCriteria);
    }

    render() {
        return (
            <div>
                {this.state.docs ?
                    <>
                        {this.state.docs.length > 0 ?
                            (<div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Doc Type</th>
                                            <th>Name</th>
                                            <th>Assignee</th>
                                            <th>Status</th>
                                            <th>comments</th>
                                            <th>Updated At</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.currentOrganization && this.state.docs.map((doc) => {
                                            const currentStatus: Status | undefined = this.props.statuses.get(doc.status);
                                            const currentDocType: DocType | undefined = this.props.docTypes.get(doc.docTypeId)
                                            return (

                                                <tr className="pt-3" key={doc.id!}>
                                                    <td>{currentDocType && currentDocType.name}</td>
                                                    <td>
                                                        <div></div><Link to={`/organizations/${this.props.currentOrganization!.login}/docs/${doc.id}`}>{doc.subject}</Link>
                                                        <LabelsList defaultSelected={doc.labels}></LabelsList></td>

                                                    <td>{(doc.assignee) && doc.assignee.username}</td>
                                                    <td>{(currentStatus) ? currentStatus.name : ""}</td>
                                                    <td>{doc.commentsNumber}</td>
                                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                                </tr>);
                                        })}
                                    </tbody>
                                </Table>
                            </div>) : <>{this.props.children}</>
                        }
                    </> :
                    (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        currentOrganization: state.organizations.currentOrganization,
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        loading: state.statuses.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestStatusesData: () => dispatch(requestStatusesData()),
        requestDocTypes: () => dispatch(requestDocTypesData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocList as any); 