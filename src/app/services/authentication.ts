import { User } from "./users";
import { Doc } from "./docs";
import { Comment } from "./comments";
import { Dashboard } from "./dashboard";
import { OrganizationTeamUser, TeamUserType } from "./organizationTeams";

export const canComment = (user: User | undefined | null): boolean => {
    return !!user;
}

export const canEditOrDeleteComment = (comment: Comment, user: User | undefined | null): boolean => {
    if (!user) {
        return false;
    } else {
        return comment.authorUserId === user.id;
    }
}

export const canPinComment = (doc: Doc, user: User | undefined | null): boolean => {
    if (!user) {
        return false;
    }
    else {
        return doc.assigneeUserId === user.id || doc.reporterUserId === user.id;
    }
}

export const canAddDashboard = (user: User | undefined | null): boolean => {
    return !!user;
}

export const canManageNotifications = (user: User | undefined | null): boolean => {
    return !!user;
}


export const canAddDoc = (user: User | undefined | null): boolean => {
    return !!user;
}

export const canEditDoc = (user: User | undefined | null, doc: Doc): boolean => {
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