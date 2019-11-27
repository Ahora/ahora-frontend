import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { labelReducer } from './labels/reducers'
import { statusesReducer } from './statuses/reducers';


const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    labels: labelReducer,
    statuses: statusesReducer
})
export default createRootReducer;