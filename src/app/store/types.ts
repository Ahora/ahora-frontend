
import { LabelsState } from './labels/types';
import { StatusesState } from './statuses/types';
import { CurrentUserState } from './currentuser/types';
import { OrganizationsState } from './organizations/types';
import { DocTypesState } from './docTypes/types';
import { MilestonesState } from './milestones/types';
import { UsersState } from './users/types';
import { ShortcutsState } from './shortcuts/types';
import { DocsState } from './docs/types';
import { CommentsState } from './comments/types';

// The top-level state object
export interface ApplicationState {
    labels: LabelsState,
    statuses: StatusesState,
    currentUser: CurrentUserState,
    docs: DocsState,
    comments: CommentsState,
    users: UsersState,
    organizations: OrganizationsState,
    milestones: MilestonesState,
    shortcuts: ShortcutsState,
    docTypes: DocTypesState
}