import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from './reducer';
import { History } from "history";
import { routerMiddleware } from 'connected-react-router'

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