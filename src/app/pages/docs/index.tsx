import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import Nav from "react-bootstrap/Nav";
import { requestStatusesData } from 'app/store/statuses/actions';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import { Link } from 'react-router-dom';
import { DocType } from 'app/services/docTypes';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import { setSearchCriteria } from 'app/store/organizations/actions';
import DocList from 'app/components/DocList';


interface DocsPageState {
    searchCriteria?: SearchCriterias;
}

interface DocsPageParams {
    docTypeCode: string;
    login: string;
}


interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    loading: boolean;
    searchCriteria?: string;
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {

}


interface DispatchProps {
    requestStatusesData(): void;
    requestDocTypes(): void;
    setSearchCriterias(data?: string): void;
}

interface AllProps extends DocsPageProps, DispatchProps {

}

class DocsPage extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        this.props.requestStatusesData();
        this.props.requestDocTypes();
    }

    async searchSelected(searchCriterias: SearchCriterias, searchCriteriasText: string) {
        this.props.setSearchCriterias(searchCriteriasText);
        this.setState({
            searchCriteria: searchCriterias
        });
    }

    render() {
        return (
            <div>
                <SearchDocsInput searchCriteria={this.props.searchCriteria} searchSelected={this.searchSelected.bind(this)}></SearchDocsInput>
                <Nav className="mb-3">
                    <Nav.Item>
                        <Link to={`/organizations/${this.props.match.params.login}/doctypes/add`}>
                            <Button variant="primary" type="button">Add</Button>
                        </Link>
                    </Nav.Item>
                </Nav>

                <DocList searchCriteria={this.state.searchCriteria}>No Results</DocList>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        loading: state.statuses.loading,
        searchCriteria: state.organizations.SearchCriterias
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setSearchCriterias: (data: string) => dispatch(setSearchCriteria(data)),
        requestStatusesData: () => dispatch(requestStatusesData()),
        requestDocTypes: () => dispatch(requestDocTypesData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 