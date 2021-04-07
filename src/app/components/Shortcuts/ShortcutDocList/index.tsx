import DocList from "app/components/DocList";
import { SearchCriterias } from "app/components/SearchDocsInput";
import { ApplicationState } from "app/store";
import { loadShortcutDocs } from "app/store/shortcuts/actions";
import StoreOrganizationShortcut from "app/store/shortcuts/StoreOrganizationShortcut";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface OwnProps {
    section: string;
    login: string;
    currentDocId?: number;
}

interface InjectableProps {
    page: number;
    totalDocs: number;
    loading: boolean;
    searchCriteria?: SearchCriterias;
    docs?: Set<number>
}

interface DispatchProps {
    loadShortcutDocs(shortcutId: string, page: number): void;
}
interface AllProps extends OwnProps, InjectableProps, DispatchProps {

}

function ShortcutDocList(props: AllProps) {

    function pageChanged(newPage: number) {
        props.loadShortcutDocs(props.section, newPage);
    }
    return <div className="doc-list-wrapper">
        <DocList onPageChanged={pageChanged} pageSize={30} totalDocs={props.totalDocs} page={props.page} section={props.section} docs={props.docs} activeDocId={props.currentDocId} searchCriteria={props.searchCriteria}>
            <div className="no-docs"><FormattedMessage id="docsNoResults" /></div>
        </DocList>
    </div>
}


const mapStateToProps = (state: ApplicationState, props: OwnProps): InjectableProps => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(props.section);
    return {
        page: availableShortcut?.page || 0,
        loading: false,
        docs: availableShortcut?.docs,
        totalDocs: (availableShortcut && availableShortcut.totalDocs) ? availableShortcut.totalDocs : 0,
        searchCriteria: availableShortcut?.draftsearchCriteria || availableShortcut?.searchCriteria
    };
};


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        loadShortcutDocs: (shortcutdId: string, page: number) => dispatch(loadShortcutDocs(shortcutdId, page)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShortcutDocList as any); 