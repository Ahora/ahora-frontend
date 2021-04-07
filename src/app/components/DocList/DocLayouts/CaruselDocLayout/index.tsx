
import React from "react"
import DocsDetails from "app/pages/docs/details";
import { Container, Section } from "react-simple-resizer";
import AhoraSpinner from "app/components/Forms/Basics/Spinner";
import { ApplicationState } from "app/store";
import StoreOrganizationShortcut from "app/store/shortcuts/StoreOrganizationShortcut";
import { connect } from "react-redux";
import AhoraFlexPanel from "app/components/Basics/AhoraFlexPanel";


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

function CaruselDocLayout(props: Props) {
    if (props.docs) {
        return <AhoraFlexPanel>
            <Container>
                {[...props.docs].slice(0, 4).map((currentDocId) =>
                    <Section style={{ padding: "4px" }} key={currentDocId} defaultSize={200} minSize={0}>
                        <DocsDetails docId={currentDocId} />
                    </Section>
                )}
            </Container>
        </AhoraFlexPanel>;
    }
    else {
        return <AhoraSpinner />
    }
}



const mapStateToProps = (state: ApplicationState, props: OwnProps): InjectableProps => {
    let availableShortcut: StoreOrganizationShortcut | undefined = state.shortcuts.map.get(props.section);
    return {
        docs: availableShortcut?.docs
    };
};


export default connect(mapStateToProps)(CaruselDocLayout as any); 