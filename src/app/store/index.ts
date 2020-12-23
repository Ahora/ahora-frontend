import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import sagaMiddleware, { initSagas } from './initSaga';
export { ApplicationState } from "./types";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history: History = createBrowserHistory();
export const appState = createRootReducer(history);
export const store = createStore(
    appState,
    composeEnhancers(
        applyMiddleware(sagaMiddleware),
        applyMiddleware(
            routerMiddleware(history),
        ),
    ),

);

initSagas();