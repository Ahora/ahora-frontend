import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Dispatch } from 'redux';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import { DocType } from 'app/services/docTypes';
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
import StoreOrganizationShortcut from 'app/store/shortcuts/StoreOrganizationShortcut';
import { updateShortcutsearchCriteria } from 'app/store/shortcuts/actions';

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
    setSearchCriterias(section: string, data?: SearchCriterias): void;
}

interface AllProps extends DocsPageProps, DispatchProps {
}

class DocsPage extends React.Component<AllProps, DocsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
        }
    }

    setSearchCriterias() {
        if (this.props.location.search.length > 0) {
            const parsedUrl: ParsedUrl = parseUrl(this.props.location.search);
            const searchCriterias: SearchCriterias = parsedUrl.query;
            this.searchSelected(searchCriterias);
        }
        else if (this.props.searchCriteria) {
            this.searchSelected(this.props.searchCriteria);
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

    async onInputSearchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string) {
        this.props.setSearchCriterias(this.props.match.params.section, searchCriterias);
        this.searchSelected(searchCriterias, searchCriteriasText);
    }

    async searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string) {
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
                const currentDoc: Doc | undefined = this.state.docs.find((doc) => doc.id === docId && doc.reporterUserId);
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

        if (this.props.searchCriteria !== PrevProps.searchCriteria) {
            console.log("componentDidUpdate", this.props.searchCriteria);
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
                {(isBrowser || (isMobile && this.props.match.params.docId === undefined)) &&
                    <div className="docsheader">
                        <SearchDocsInput searchCriterias={this.state.searchCriteria} searchSelected={this.onInputSearchSelected.bind(this)}></SearchDocsInput>
                    </div>
                }
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
                                                            <Link className="add-doc-button" to={`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/add`}>
                                                                <Button className="add-button" block type="primary">
                                                                    <PlusOutlined />Add Discussion</Button>
                                                            </Link>
                                                        </CanAddDoc>
                                                        <div className="doc-list-wrapper scrollable">
                                                            <DocList section={this.props.match.params.section} docs={this.state.docs} onDocListUpdated={this.onDocListUpdated.bind(this)} activeDocId={this.state.currentDocId} searchCriteria={this.state.searchCriteria}>
                                                                <div className="no-docs">No Results</div>
                                                            </DocList>
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
                                                                    <Route path={`/organizations/:login/:section/add`} component={(props: any) => <AddDocPage {...props} onCancel={this.onAddCancel.bind(this)} onDocAdded={this.onDocAdded.bind(this)} />} />
                                                                    <Route path={`/organizations/:login/:section`} component={DefaultDocsPage} />
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

const mapStateToProps = (state: ApplicationState, props: AllProps): injectedParams => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(props.match.params.section);
    console.log("maptostate", props.match.params.section, availableShortcut && availableShortcut.searchCriteria, state.shortcuts.map)
    return {
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        loading: state.statuses.loading,
        searchCriteria: availableShortcut && availableShortcut.searchCriteria
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setSearchCriterias: (shurtcutdId: string, data: SearchCriterias) => dispatch(updateShortcutsearchCriteria(shurtcutdId, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 