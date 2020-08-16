import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import { DocType } from 'app/services/docTypes';
import { setSearchCriteria } from 'app/store/organizations/actions';
import { parseUrl, ParsedUrl } from "query-string";
import { Doc } from 'app/services/docs';
import DocList from 'app/components/DocList';
import DocsDetailsPage from "app/pages/docs/details";
import AddDocPage from "app/pages/docs/add";
import CanAddDoc from 'app/components/Authentication/CanAddDoc';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DefaultDocsPage from './default';

import { isMobile, isBrowser } from "react-device-detect";

require('./styles.scss')


interface DocsPageState {
    searchCriteria?: SearchCriterias;
    searchCriteriasText?: string;
    currentDocId?: number;
    currentDoc?: Doc;
    docs?: Doc[]
}

interface DocsPageParams {
    section: string;
    login: string;
    docId: string;
}


interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    loading: boolean;
    searchCriteria?: SearchCriterias;
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {

}


interface DispatchProps {
    setSearchCriterias(data?: SearchCriterias): void;
}

interface AllProps extends DocsPageProps, DispatchProps {

}

class DocsPage extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
        }
    }

    printTextOfQuery(field: string, val: string | string[]): string {
        if (typeof (val) === "string") {
            return `${field}:${val}`;
        }
        else {
            return val.map((itemVal) => `${field}:${itemVal}`).join(" ");

        }
    }

    setSearchCriterias() {
        if (this.props.location.search.length > 0) {
            const parsedUrl: ParsedUrl = parseUrl(this.props.location.search);
            const searchCriterias: SearchCriterias = parsedUrl.query;
            this.searchSelected(searchCriterias);
        }
        else if (this.props.searchCriteria) {
            if (this.props.match.params.section === "inbox") {
                this.searchSelected({ mention: "me", status: "open" });

            }
            else {
                this.searchSelected(this.props.searchCriteria);

            }
        } else {
            this.searchSelected({});
        }
    }

    async componentDidMount() {
        this.setSearchCriterias();

        const docId: number = parseInt(this.props.match.params.docId);
        if (!isNaN(docId)) {
            this.setState({
                currentDocId: isNaN(docId) ? undefined : docId
            });
        }
    }

    async searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string) {
        if (this.props.match.params.section === "docs") {
            this.props.setSearchCriterias(searchCriterias);
        }
        this.setState({
            searchCriteria: searchCriterias,
            searchCriteriasText,
            docs: undefined
        });
    }

    onDocListUpdated(docs: Doc[]) {
        this.setState({ docs });
    }

    async componentDidUpdate(PrevProps: AllProps) {
        if (this.props.match.params.docId !== PrevProps.match.params.docId) {

            const docId: number = parseInt(this.props.match.params.docId);
            if (!isNaN(docId) && this.state.docs) {
                const currentDoc: Doc | undefined = this.state.docs.find((doc) => doc.id === docId && doc.reporter);
                this.setState({
                    currentDoc,
                    currentDocId: isNaN(docId) ? undefined : docId
                });
            }
            else {
                this.setState({
                    currentDoc: undefined,
                    currentDocId: undefined
                });
            }
        }

        if (this.props.match.params.section !== PrevProps.match.params.section) {
            this.setSearchCriterias();
        }
    }

    onDocDeleted(updatedDoc: Doc) {
        if (this.state.docs) {
            this.setState({
                docs: this.state.docs.filter((doc) => doc.id !== updatedDoc.id)
            });
            this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}`);
        }
    }

    onDocUpdated(updatedDoc: Doc) {
        if (this.state.docs) {
            this.setState({
                docs: [...this.state.docs.map((doc) => (doc.id === updatedDoc.id) ? updatedDoc : doc)]
            })
        }
    }

    onAddCancel() {
        if (this.props.history.length <= 2) {
            this.props.history.push(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}`)

        }
        else {
            this.props.history.goBack();
        }
    }

    onDocAdded(addedDoc: Doc) {
        this.setState({ docs: [addedDoc, ...this.state.docs] });
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/${addedDoc.id}`)
    }

    render() {
        return (
            <section style={{ height: "100%" }} className="ant-layout site-layout">
                <div className="docsheader">
                    <SearchDocsInput searchCriterias={this.state.searchCriteria} searchSelected={this.searchSelected.bind(this)}></SearchDocsInput>
                </div>
                <section className="ant-layout site-layout">
                    <div className="ant-layout">
                        <div className="ant-layout site-layout-content">
                            <div className="content-wrapper">
                                <div className="content">
                                    <div className="main-content">
                                        <div className="content-wrapper">
                                            <div className="content">
                                                {
                                                    (isBrowser || (isMobile && this.props.match.params.docId === undefined)) &&
                                                    <div className={isBrowser ? "left-side" : "main-content"}>
                                                        <CanAddDoc>
                                                            <Link className="add-doc-button" to={`/organizations/${this.props.match.params.login}/docs/add`}>
                                                                <Button className="add-button" block type="primary">
                                                                    <PlusOutlined />Add doc</Button>
                                                            </Link>
                                                        </CanAddDoc>
                                                        <div className="doc-list-wrapper scrollable">
                                                            <DocList section={this.props.match.params.section} docs={this.state.docs} onDocListUpdated={this.onDocListUpdated.bind(this)} activeDocId={this.state.currentDocId} searchCriteria={this.state.searchCriteria}>No Results</DocList>
                                                        </div>
                                                    </div>
                                                }
                                                {(isBrowser || (isMobile && this.props.match.params.docId)) &&
                                                    <div className="main-content">
                                                        <div className="scrollable">
                                                            {this.state.currentDocId ?
                                                                <DocsDetailsPage onDocDeleted={this.onDocDeleted.bind(this)} onDocUpdated={this.onDocUpdated.bind(this)} doc={this.state.currentDoc} {...this.props}></DocsDetailsPage>
                                                                :
                                                                <Switch>
                                                                    <Route path={`/organizations/:login/docs/add`} component={(props: any) => <AddDocPage {...props} onCancel={this.onAddCancel.bind(this)} onDocAdded={this.onDocAdded.bind(this)} />} />
                                                                    <Route path={`/organizations/:login/docs`} component={DefaultDocsPage} />
                                                                </Switch>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        loading: state.statuses.loading,
        searchCriteria: state.organizations.searchCriterias
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setSearchCriterias: (data: SearchCriterias) => dispatch(setSearchCriteria(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 