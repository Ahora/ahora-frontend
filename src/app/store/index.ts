import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router';
import { LabelsState } from './labels/types';
import createSagaMiddleware from "redux-saga";
import labelSaga from "./labels/sagas";
import statusesSaga from "./statuses/sagas";
import milestoneSaga from "./milestones/sagas";
import shortcutSaga from "./shortcuts/sagas";
import refreshShortcutSaga from "./shortcuts/refreshShortctsData";
import docTypeSaga from "./docTypes/sagas";
import receiveCommentsSaga from "./comments/receiveCommentsSaga";
import usersSaga from "./users/sagas";
import currentUserSaga from "./currentuser/sagas";
import loadShortcutDocsSaga from "./shortcuts/loadShortcutDocs";
import { StatusesState } from './statuses/types';
import { CurrentUserState } from './currentuser/types';
import { createBrowserHistory } from 'history';
import { OrganizationsState } from './organizations/types';
import { DocTypesState } from './docTypes/types';
import { MilestonesState } from './milestones/types';
import { UsersState } from './users/types';
import { ShortcutsState } from './shortcuts/types';
import thunk from 'redux-thunk';
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

export const history: History = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
export const appState = createRootReducer(history);
export const store = createStore(
    appState,
    compose(
        applyMiddleware(thunk),
        applyMiddleware(sagaMiddleware),
        applyMiddleware(
            routerMiddleware(history),
        ),
    ),
);


sagaMiddleware.run(receiveCommentsSaga);
sagaMiddleware.run(labelSaga);
sagaMiddleware.run(docTypeSaga);
sagaMiddleware.run(statusesSaga);
sagaMiddleware.run(milestoneSaga);
sagaMiddleware.run(shortcutSaga);
sagaMiddleware.run(refreshShortcutSaga);
sagaMiddleware.run(loadShortcutDocsSaga);
sagaMiddleware.run(currentUserSaga);
sagaMiddleware.run(usersSaga);