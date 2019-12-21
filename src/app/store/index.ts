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
import { createBrowserHistory } from 'history';
import { OrganizationsState } from './organizations/types';

// The top-level state object
export interface ApplicationState {
    labels: LabelsState,
    statuses: StatusesState,
    currentUser: CurrentUserState,
    organizations: OrganizationsState
}

export const history: History = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
export const appState = createRootReducer(history);
export const store = createStore(
    appState, // root reducer with router state
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