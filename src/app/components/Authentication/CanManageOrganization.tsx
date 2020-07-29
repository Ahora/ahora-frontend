import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { canManageOrganization } from 'app/services/authentication';
import { Organization } from 'app/services/organizations';
import { OrganizationTeamUser } from 'app/services/organizationTeams';

interface CanManageOrganizationProps {
    currentOrgPermission?: OrganizationTeamUser;
}

interface AllProps extends CanManageOrganizationProps {
    organization: Organization;
}

class CanManageOrganization extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        if (canManageOrganization(this.props.currentOrgPermission)) {
            console.log("tolat")
            return this.props.children;
        }
        else {
            console.log("meshi")

            return null;
        }
    };
}


const mapStateToProps = (state: ApplicationState): CanManageOrganizationProps => {
    return {
        currentOrgPermission: state.organizations.currentOrgPermission
    };
};

export default connect(mapStateToProps)(CanManageOrganization as any); 