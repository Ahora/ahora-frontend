import * as React from 'react';
import { Doc, getDocs, SearchDocResult } from 'app/services/docs';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import Moment from 'react-moment';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { Link } from 'react-router-dom';
import { DocType } from 'app/services/docTypes';
import LabelsList from 'app/components/LabelsSelector/details';
import { Organization } from 'app/services/organizations';
import AhoraSpinner from '../Forms/Basics/Spinner';
import UltimatePagination from '../Paginations';

interface DocsPageState {
    docs: Doc[] | null;
    page: number;
    totalPages: number;
}

interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    loading: boolean;
    currentOrganization: Organization | undefined,
}

interface DocsPageProps extends injectedParams {
    searchCriteria?: SearchCriterias;
    pageSize?: number;
}

interface AllProps extends DocsPageProps {

}
class DocList extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            docs: null,
            page: 1,
            totalPages: 0
        }
    }

    async loadData(searchCriteria: SearchCriterias, page: number, pageSize: number) {
        this.setState({
            docs: null
        });
        page = page || this.state.page;
        const searchResult: SearchDocResult = await getDocs(searchCriteria, pageSize * (page - 1), pageSize);
        this.setState({
            docs: searchResult.docs,
            totalPages: Math.ceil(searchResult.totalCount / pageSize)
        });
    }

    componentWillReceiveProps(nextProps: DocsPageProps) {
        if (nextProps.searchCriteria !== this.props.searchCriteria ||
            nextProps.pageSize !== this.props.pageSize) {
            if (nextProps.searchCriteria) {
                this.loadData(nextProps.searchCriteria, 1, nextProps.pageSize || 30);

            }
            else {
                this.setState({
                    docs: null
                });
            }
        }
    }

    async componentDidMount() {
        if (this.props.searchCriteria) {
            this.loadData(this.props.searchCriteria, 1, this.props.pageSize || 30);
        }
        else {
            this.setState({
                docs: []
            });
        }
    }

    onChange(newPage: number) {
        this.setState({
            page: newPage
        });

        if (this.props.searchCriteria) {
            this.loadData(this.props.searchCriteria, newPage, this.props.pageSize || 30);
        }
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
                                            <th>Repository</th>
                                            <th>Name</th>
                                            <th>Assignee</th>
                                            <th>Status</th>
                                            <th>Comments</th>
                                            <th>Views</th>
                                            <th>Updated At</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.currentOrganization && this.state.docs.map((doc) => {
                                            const currentStatus: Status | undefined = this.props.statuses.get(doc.statusId);
                                            const currentDocType: DocType | undefined = this.props.docTypes.get(doc.docTypeId)
                                            return (

                                                <tr className="pt-3" key={doc.id!}>
                                                    <td>{currentDocType && currentDocType.name}</td>
                                                    <td>{doc.source && doc.source.repo}</td>
                                                    <td>
                                                        <Link to={`/organizations/${this.props.currentOrganization!.login}/docs/${doc.id}`}>{doc.subject}</Link>
                                                        <div><LabelsList defaultSelected={doc.labels}></LabelsList></div>
                                                    </td>
                                                    <td>{(doc.assignee) && doc.assignee.username}</td>
                                                    <td>{(currentStatus) ? currentStatus.name : ""}</td>
                                                    <td>{doc.commentsNumber}</td>
                                                    <td>{doc.views}</td>
                                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                                </tr>);
                                        })}
                                    </tbody>
                                </Table>
                                {this.state.totalPages > 1 &&
                                    <UltimatePagination onChange={this.onChange.bind(this)} currentPage={this.state.page} totalPages={this.state.totalPages}></UltimatePagination>
                                }
                            </div>) : <>{this.props.children}</>
                        }
                    </> :
                    (
                        <AhoraSpinner />
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


export default connect(mapStateToProps, null)(DocList as any); 