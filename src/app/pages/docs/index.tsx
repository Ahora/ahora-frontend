import * as React from 'react';
import { Doc, getDocs } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import Nav from "react-bootstrap/Nav";
import { requestStatusesData } from 'app/store/statuses/actions';
import Moment from 'react-moment';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

interface DocsPageState {
    docs: Doc[] | null;
}

interface DocsPageParams {
    docType: string;
    login: string;
}


interface injectedParams {
    statuses: Map<number, Status>;
    loading: boolean
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {

}


interface DispatchProps {
    requestStatusesData(): void;
}

interface AllProps extends DocsPageProps, DispatchProps {

}

class DocsPage extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            docs: null
        }
    }

    componentWillReceiveProps(nextProps: DocsPageProps) {
        if (nextProps.match.params.docType !== this.props.match.params.docType!) {
            this.setState({
                docs: null
            });
        }
    }

    async componentDidMount() {
        this.props.requestStatusesData();
    }

    async searchSelected(searchCriterias: SearchCriterias) {
        //Show spinner while searching
        this.setState({
            docs: null
        });
        const docs: Doc[] = await getDocs(this.props.match.params.login, this.props.match.params.docType, searchCriterias);
        this.setState({
            docs
        });
    }

    render() {
        return (
            <div>
                <SearchDocsInput docType={this.props.match.params.docType} searchCriteria="status:opened" searchSelected={this.searchSelected.bind(this)}></SearchDocsInput>
                <Nav className="mb-3">
                    <Nav.Item>
                        <Link to={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/add`}>
                            <Button variant="primary" type="button">Add</Button>
                        </Link>
                    </Nav.Item>
                </Nav>

                {this.state.docs ?
                    (<Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Assignee</th>
                                <th>Status</th>
                                <th>Updated At</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.docs.map((doc) => {
                                const currentStatus: Status | undefined = this.props.statuses.get(doc.status);
                                return (
                                    <tr className="pt-3" key={doc.id!}>
                                        <td><Link to={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${doc.id}`}>{doc.subject}</Link></td>
                                        <td>{(doc.assignee) && doc.assignee.username}</td>
                                        <td>{(currentStatus) ? currentStatus.name : ""}</td>
                                        <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                        <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                    </tr>);
                            })}
                        </tbody>
                    </Table>) :
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
        statuses: state.statuses.map,
        loading: state.statuses.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestStatusesData: () => dispatch(requestStatusesData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 