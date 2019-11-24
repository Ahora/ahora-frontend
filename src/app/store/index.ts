import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router';
import { LabelsState } from './labels/types';

// The top-level state object
export interface ApplicationState {
    labels: LabelsState
}


export default function configureStore(history: History) {
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        compose(
            applyMiddleware(
                routerMiddleware(history),
            ),
        ),
    )

    return store
}