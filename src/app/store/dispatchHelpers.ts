import { AnyAction } from "redux";
import { store } from ".";

export const ahoraDispatch = (action: AnyAction) => {
    store.dispatch(action);
}