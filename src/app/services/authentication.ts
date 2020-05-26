import { User } from "./users";
import { Doc } from "./docs";
import { Dashboard } from "./dashboard";
import { OrganizationTeamUser, TeamUserType } from "./organizationTeams";

export const canComment = (user: User | undefined | null): boolean => {
    return !!user;
}

export const canAddDoc = (user: User | undefined | null): boolean => {
    return !!user;
}

export const canEditDoc = (user: User | undefined | null, doc: Doc): boolean => {
    //Check if the user is logged in and is assignee or reporter
    return !!user &&
        (doc.reporterUserId === user.id || doc.assigneeUserId === user.id)
}

export const canEditDashboard = (user: User | undefined | null, dashboard: Dashboard): boolean => {
    //Check if the user is logged in and is assignee or reporter
    return !!user &&
        (dashboard.userId === user.id)
}

export const canManageOrganization = (permission?: OrganizationTeamUser): boolean => {
    if (permission) {
        return permission.permissionType === TeamUserType.Owner;
    }
    else {
        return false;
    }
}