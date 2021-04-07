import AhoraFlexPanel from "app/components/Basics/AhoraFlexPanel"
import AddDocButton from "app/components/Doc/AddDocButton";
import ShortcutDocList from "app/components/Shortcuts/ShortcutDocList";
import React from "react"
import { isMobile } from "react-device-detect";
import DocsDetails from "app/pages/docs/details";
import DefaultDocsPage from "app/pages/docs/default";

interface OwnProps {
    section: string;
    login: string;
    currentDocId?: number;
}

interface InjectableProps {
    docs?: Set<number>
}

interface Props extends OwnProps, InjectableProps {

}

export default function SideBySideDocLayout(props: Props) {
    return <>
        {isMobile ?
            <>
                {props.currentDocId === undefined ?
                    <>
                        <AddDocButton section={props.section} login={props.login} />
                        <ShortcutDocList currentDocId={props.currentDocId} section={props.section} login={props.login}></ShortcutDocList>
                    </>
                    :
                    <>
                        <DocsDetails docId={props.currentDocId}></DocsDetails>

                    </>
                }
            </>
            : //Browser!
            <AhoraFlexPanel left={
                <AhoraFlexPanel top={<AddDocButton section={props.section} login={props.login} />}>
                    <ShortcutDocList currentDocId={props.currentDocId} section={props.section} login={props.login}></ShortcutDocList>
                </AhoraFlexPanel>
            }>
                {props.currentDocId ?
                    <DocsDetails docId={props.currentDocId}></DocsDetails>
                    :
                    <DefaultDocsPage />
                }
            </AhoraFlexPanel>
        }
    </>
} 