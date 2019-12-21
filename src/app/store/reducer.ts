import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { labelReducer } from './labels/reducers'
import { statusesReducer } from './statuses/reducers';
import { currentUserReducer } from './currentuser/reducers';
import { currentOrganizationsReducer } from './organizations/reducers';


const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    labels: labelReducer,
    statuses: statusesReducer,
    currentUser: currentUserReducer,
    organizations: currentOrganizationsReducer
})
export default createRootReducer;