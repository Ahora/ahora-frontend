import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { canManageOrganization } from 'app/services/authentication';
import { Organization } from 'app/services/organizations';
import { OrganizationTeamUser } from 'app/services/organizationTeams';

interface CanManageOrganizationProps {
    currentOrgPermission?: OrganizationTeamUser;
}

interface DispatchProps {
    requestCurrentUser(): void;
}

interface AllProps extends CanManageOrganizationProps, DispatchProps {
    organization: Organization;
}

class CanManageOrganization extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    async componentDidMount() {
        this.props.requestCurrentUser();
    }

    render() {
        return (
            <>
                {canManageOrganization(this.props.currentOrgPermission) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanManageOrganizationProps => {
    return {
        currentOrgPermission: state.organizations.currentOrgPermission
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestCurrentUser: () => dispatch(requestCurrentUserData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanManageOrganization as any); 