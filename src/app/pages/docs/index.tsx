import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
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
import { addDocToShortcut, loadShortcutDocs, updateShortcutsearchCriteria } from 'app/store/shortcuts/actions';
import { deleteDocInState, setDocInState } from 'app/store/docs/actions';
import AhoraFlexPanel from 'app/components/Basics/AhoraFlexPanel';

require('./styles.scss')

interface DocsPageState {
    searchCriteria?: SearchCriterias;
    searchCriteriasText?: string;
    currentDocId?: number;
}

interface DocsPageParams {
    section: string;
    login: string;
    docId: string;
}


interface injectedParams {
    page: number;
    totalDocs: number;
    loading: boolean;
    searchCriteria?: SearchCriterias;
    docs?: Set<number>
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {
}


interface DispatchProps {
    setSearchCriterias(section: string, data?: SearchCriterias): void;
    loadShortcutDocs(shortcutId: string, page: number): void;
    deleteDoc(docId: number): void;
    updateDoc(doc: Doc): void;
    addDoc(shortcutdId: string, doc: Doc): void;
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

        if (!this.props.docs) {
            this.props.loadShortcutDocs(this.props.match.params.section, 1);
        }
    }

    pageChanged(newPage: number) {
        this.props.loadShortcutDocs(this.props.match.params.section, newPage);
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
        this.props.loadShortcutDocs(this.props.match.params.section, 1);
        this.searchSelected(searchCriterias, searchCriteriasText);
    }

    async searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string) {
        this.setState({
            searchCriteria: searchCriterias,
            searchCriteriasText
        });
    }
    async componentDidUpdate(PrevProps: AllProps) {
        if (this.props.match.params.docId !== PrevProps.match.params.docId) {
            const docId: number = parseInt(this.props.match.params.docId);
            this.setState({ currentDocId: isNaN(docId) ? undefined : docId });
        }

        if (this.props.searchCriteria !== PrevProps.searchCriteria) {
            this.setSearchCriterias();
        }

    }

    onDocDeleted(docToBeDeleted: Doc) {
        this.props.deleteDoc(docToBeDeleted.id);
        this.props.history.push(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}`)
    }

    onDocUpdated(updatedDoc: Doc) {
        this.props.updateDoc(updatedDoc);
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
        this.props.addDoc(this.props.match.params.section, addedDoc);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/${addedDoc.id}`)
    }

    renderDocList() {
        return (<div className="doc-list-wrapper">
            <DocList onPageChanged={this.pageChanged.bind(this)} pageSize={30} totalDocs={this.props.totalDocs} page={this.props.page} section={this.props.match.params.section} docs={this.props.docs} activeDocId={this.state.currentDocId} searchCriteria={this.state.searchCriteria}>
                <div className="no-docs">No Results</div>
            </DocList>
        </div>);
    }

    renderDocListTop() {
        return (
            <CanAddDoc>
                <Link className="add-doc-button" to={`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/add`}>
                    <Button className="add-button" block type="primary">
                        <PlusOutlined />Add Discussion</Button>
                </Link>
            </CanAddDoc>
        );
    }

    renderDocDetails() {
        if (this.state.currentDocId) {
            return <DocsDetailsPage onDocDeleted={this.onDocDeleted.bind(this)} onDocUpdated={this.onDocUpdated.bind(this)} {...this.props}></DocsDetailsPage>
        }
        else {
            return <Switch>
                <Route path={`/organizations/:login/:section/add`} component={(props: any) => <AddDocPage {...props} onCancel={this.onAddCancel.bind(this)} onDocAdded={this.onDocAdded.bind(this)} />} />
                <Route path={`/organizations/:login/:section`} component={DefaultDocsPage} />
            </Switch>
        }
    }

    render() {
        return (

            <AhoraFlexPanel top={(isBrowser || (isMobile && this.props.match.params.docId === undefined)) &&
                <div className="docsheader">
                    <SearchDocsInput searchCriterias={this.state.searchCriteria} searchSelected={this.onInputSearchSelected.bind(this)}></SearchDocsInput>
                </div>
            }>
                <div className="site-layout-content">
                    {isMobile ?
                        <>
                            {this.props.match.params.docId === undefined ?
                                <>
                                    {this.renderDocListTop()}
                                    {this.renderDocList()}
                                </>
                                :
                                <>
                                    {this.renderDocDetails()}
                                </>
                            }
                        </>
                        :
                        <AhoraFlexPanel left={
                            <AhoraFlexPanel top={this.renderDocListTop()}>
                                {this.renderDocList()}
                            </AhoraFlexPanel>
                        }>

                            {this.renderDocDetails()}

                        </AhoraFlexPanel>
                    }
                </div>
            </AhoraFlexPanel>
        );
    };
}

const mapStateToProps = (state: ApplicationState, props: AllProps): injectedParams => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(props.match.params.section);
    return {
        page: availableShortcut?.page || 0,
        loading: false,
        docs: availableShortcut?.docs,
        totalDocs: (availableShortcut && availableShortcut.totalDocs) ? availableShortcut.totalDocs : 0,
        searchCriteria: availableShortcut?.searchCriteria
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        setSearchCriterias: (shortcutdId: string, data: SearchCriterias) => dispatch(updateShortcutsearchCriteria(shortcutdId, data)),
        loadShortcutDocs: (shortcutdId: string, page: number) => dispatch(loadShortcutDocs(shortcutdId, page)),
        deleteDoc: (docId: number) => dispatch(deleteDocInState(docId)),
        updateDoc: (doc: Doc) => dispatch(setDocInState(doc)),
        addDoc: (shortcutdId: string, doc: Doc) => {
            dispatch(setDocInState(doc));
            dispatch(addDocToShortcut(shortcutdId, doc.id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any); 