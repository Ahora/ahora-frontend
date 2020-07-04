import * as React from 'react';
import { ApplicationState } from 'app/store';

import { connect } from 'react-redux';
import { DocSource } from 'app/services/docSources';
import AhoraOrganizationAutoCompleteField, { OrgValue } from '../Forms/Fields/OrganizationAutoComplete';

interface MilestonesPageParams {
    organizationId: string;
}

interface MilestonesPageProps extends MilestonesPageParams {
    docSources?: DocSource[];

}

class SyncOrganization extends React.Component<MilestonesPageProps> {
    constructor(props: MilestonesPageProps) {
        super(props);
    }

    onUpdate(orgData: OrgValue) {

    }

    render() {
        return (
            <div>
                <AhoraOrganizationAutoCompleteField formData={{}} fieldData={{ displayName: "Organization", fieldName: "organization", fieldType: "" }} onUpdate={this.onUpdate.bind(this)}></AhoraOrganizationAutoCompleteField>
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): MilestonesPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
    };
};


export default connect(mapStateToProps, null)(SyncOrganization as any); 
