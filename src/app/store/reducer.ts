import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { labelReducer } from './labels/reducers'


const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    labels: labelReducer
})
export default createRootReducer;