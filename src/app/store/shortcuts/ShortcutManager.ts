import { Doc, getDocs, SearchDocResult } from "app/services/docs";
import { OrganizationShortcut } from "app/services/OrganizationShortcut";
import { setDocInState } from "../docs/actions";
import { store } from "app/store";

export default class ShortcutManager {



    constructor(private shortcut: OrganizationShortcut) {


    }

    public async loadDocs() {
        const searchResult: SearchDocResult = await getDocs(this.shortcut.searchCriteria);
        searchResult.docs.forEach((doc: Doc) => {
            store.dispatch(setDocInState(doc))
        })
    }

    public setShortCut(shortcut: OrganizationShortcut) {
        this.shortcut = shortcut;
    }
}