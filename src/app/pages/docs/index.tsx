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

interface DocsPageState {
    docs: Doc[];
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
            docs: []
        }
    }

    async componentDidMount() {
        this.props.requestStatusesData();
        const docs: Doc[] = await getDocs(this.props.match.params.login, this.props.match.params.docType);
        this.setState({
            docs
        });
    }

    async searchSelected(searchCriterias: SearchCriterias) {
        const docs: Doc[] = await getDocs(this.props.match.params.login, this.props.match.params.docType, searchCriterias);
        this.setState({
            docs
        });
    }

    render() {
        return (
            <div>
                <SearchDocsInput searchSelected={this.searchSelected.bind(this)}></SearchDocsInput>
                <Nav className="mb-3">
                    <Nav.Item>
                        <Button variant="primary" type="button" href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/add`}>
                            Add
                        </Button>
                    </Nav.Item>
                </Nav>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
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
                                    <td><a href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${doc.id}`}>{doc.subject}</a></td>
                                    <td>{(currentStatus) ? currentStatus.name : ""}</td>
                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                    <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                </tr>);
                        })}
                    </tbody>
                </Table>
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