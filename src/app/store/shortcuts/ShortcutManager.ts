import { Doc, getDocGroup, getDocs, SearchDocResult } from "app/services/docs";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import { setDocsInState } from "../docs/actions";
import { store } from "app/store";
import { setShortcutUnReadAndDocs } from "./actions";

export default class ShortcutManager {

    private refreshInterval?: NodeJS.Timeout;

    constructor(private shortcutId: string | number, private shortcut?: OrganizationShortcut) {

    }

    public async refresh() {
        if (this.shortcut) {
            const unreadData = await getDocGroup("nothing", this.shortcut.searchCriteria);
            const searchResult: SearchDocResult = await getDocs(this.shortcut.searchCriteria);
            const docIds: number[] = searchResult.docs.map((doc: Doc) => doc.id);
            store.dispatch(setDocsInState(searchResult.docs));
            store.dispatch(setShortcutUnReadAndDocs(this.shortcutId, unreadData[0].count, docIds));
        }
    }



    public stop() {
        if (this.refreshInterval) {
            clearTimeout(this.refreshInterval);
            this.refreshInterval = undefined;
        }
    }

    public setShortCut(shortcut: OrganizationShortcut) {
        this.shortcut = shortcut;
        this.refresh();
    }
}