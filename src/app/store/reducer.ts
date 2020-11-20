import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { labelsReducer } from './labels/reducers'
import { statusesReducer } from './statuses/reducers';
import { milestonesReducer } from './milestones/reducers';
import { currentUserReducer } from './currentuser/reducers';
import { currentOrganizationsReducer } from './organizations/reducers';
import { docTypesReducer } from './docTypes/reducers';
import { usersReducer } from './users/reducers';
import { docsReducer } from './docs/reducers';
import { shortcutsReducer } from './shortcuts/reducers';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    labels: labelsReducer,
    users: usersReducer,
    docs: docsReducer,
    statuses: statusesReducer,
    shortcuts: shortcutsReducer,
    currentUser: currentUserReducer,
    organizations: currentOrganizationsReducer,
    milestones: milestonesReducer,
    docTypes: docTypesReducer
})
export default createRootReducer;