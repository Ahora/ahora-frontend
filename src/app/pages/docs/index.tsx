import * as React from 'react';
import { Doc, getDocs } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import { requestStatusesData } from 'app/store/statuses/actions';
import Moment from 'react-moment';

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

    render() {
        return (
            <div>
                <h2>{this.props.match.params.docType}</h2>
                <Button variant="primary" type="button" href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/add`}>
                    Add
                </Button>
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