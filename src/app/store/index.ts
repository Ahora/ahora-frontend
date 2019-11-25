import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router';
import { LabelsState } from './labels/types';
import createSagaMiddleware from "redux-saga";
import mySaga from "./labels/sagas";



// The top-level state object
export interface ApplicationState {
    labels: LabelsState
}


export default function configureStore(history: History) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        compose(
            applyMiddleware(sagaMiddleware),
            applyMiddleware(
                routerMiddleware(history),
            ),
        ),
    );

    sagaMiddleware.run(mySaga);

    return store
}