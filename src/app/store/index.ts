import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router';
import { LabelsState } from './labels/types';
import createSagaMiddleware from "redux-saga";
import labelSaga from "./labels/sagas";
import statusesSaga from "./statuses/sagas";
import currentUserSaga from "./currentuser/sagas";
import { StatusesState } from './statuses/types';
import { CurrentUserState } from './currentuser/types';

// The top-level state object
export interface ApplicationState {
    labels: LabelsState,
    statuses: StatusesState,
    currentUser: CurrentUserState
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

    sagaMiddleware.run(labelSaga);
    sagaMiddleware.run(statusesSaga);
    sagaMiddleware.run(currentUserSaga);

    return store
}