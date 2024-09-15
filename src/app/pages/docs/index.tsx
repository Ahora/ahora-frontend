import * as React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import { parseUrl, ParsedUrl } from "query-string";
import { Doc } from 'app/services/docs';
import AddDocPage from "app/pages/docs/add";
import { isMobile, isBrowser } from "react-device-detect";
import StoreOrganizationShortcut from 'app/store/shortcuts/StoreOrganizationShortcut';
import { addDocToShortcut, loadShortcutDocs, updateShortcutDraftsearchCriteriaAction } from 'app/store/shortcuts/actions';
import { setDocInState } from 'app/store/docs/actions';
import AhoraFlexPanel from 'app/components/Basics/AhoraFlexPanel';
import ShortcutTitle from 'app/components/Shortcuts/ShortcutTitle';
import SideBySideDocLayout from 'app/components/DocList/DocLayouts/SideBySideDocLayout';
import CaruselDocLayout from 'app/components/DocList/DocLayouts/CaruselDocLayout';

require('./styles.scss')

interface DocsPageState {
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
    layout?: string;
    searchCriteria?: SearchCriterias;
    docs?: Set<number>,
}

interface DocsPageProps extends RouteComponentProps<DocsPageParams>, injectedParams {
}


interface DispatchProps {
    loadShortcutDocs(shortcutId: string, page: number): void;
    setDraftSearchCriterias(section: string, data?: SearchCriterias): void;
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
            const parsedUrl: ParsedUrl = parseUrl(this.props.location.search, { parseNumbers: true, parseBooleans: true });
            const searchCriterias: SearchCriterias = { ...parsedUrl.query, status: ["closed"] };
            this.props.setDraftSearchCriterias(this.props.match.params.section, searchCriterias)
        }
        if (!this.props.docs) {
            this.props.loadShortcutDocs(this.props.match.params.section, 1);
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

    async componentDidUpdate(PrevProps: AllProps) {
        if (this.props.match.params.docId !== PrevProps.match.params.docId) {
            const docId: number = parseInt(this.props.match.params.docId);
            this.setState({ currentDocId: isNaN(docId) ? undefined : docId });
        }

        if (this.props.match.params.section !== PrevProps.match.params.section) {
            if (!this.props.docs) {
                this.props.loadShortcutDocs(this.props.match.params.section, 1);
            }
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
        this.props.addDoc(this.props.match.params.section, addedDoc);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/${this.props.match.params.section}/${addedDoc.id}`)
    }

    renderLayout() {
        switch (this.props.layout) {
            case "carusel":
                return <CaruselDocLayout currentDocId={this.state.currentDocId} section={this.props.match.params.section} login={this.props.match.params.login} />

            default:
                return <SideBySideDocLayout currentDocId={this.state.currentDocId} section={this.props.match.params.section} login={this.props.match.params.login} />;
        }
    }

    renderMainContent() {
        return <Switch>
            <Route path={`/organizations/:login/:section/add`} component={(props: any) => <AddDocPage {...props} onCancel={this.onAddCancel.bind(this)} onDocAdded={this.onDocAdded.bind(this)} />} />
            <Route path={`/organizations/:login/:section`} component={() => <>
                {this.renderLayout()}
            </>} />
        </Switch>
    }

    render() {
        return (

            <AhoraFlexPanel top={(isBrowser || (isMobile && this.props.match.params.docId === undefined)) &&
                <div className="docsheader">
                    <ShortcutTitle shortcutdId={this.props.match.params.section} />
                </div>
            }>
                <div className="site-layout-content">
                    {this.renderMainContent()}
                </div>
            </AhoraFlexPanel>
        );
    };
}

const mapStateToProps = (state: ApplicationState, props: AllProps): injectedParams => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(props.match.params.section);
    return {
        page: availableShortcut?.page || 0,
        layout: availableShortcut?.layout,
        loading: false,
        docs: availableShortcut?.docs,
        totalDocs: (availableShortcut && availableShortcut.totalDocs) ? availableShortcut.totalDocs : 0,
        searchCriteria: availableShortcut?.draftsearchCriteria || availableShortcut?.searchCriteria
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        loadShortcutDocs: (shortcutdId: string, page: number) => dispatch(loadShortcutDocs(shortcutdId, page)),
        setDraftSearchCriterias: (shortcutdId: string, data: SearchCriterias) => dispatch(updateShortcutDraftsearchCriteriaAction(shortcutdId, data)),
        addDoc: (shortcutdId: string, doc: Doc) => {
            dispatch(setDocInState(doc));
            dispatch(addDocToShortcut(shortcutdId, doc.id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsPage as any);