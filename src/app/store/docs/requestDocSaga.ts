import { getDoc } from 'app/services/docs';
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setDocInState } from './actions';
import { RequestDocAction, REQUEST_DOC } from './types';
import { ApplicationState } from '..';
export const getStateFromStore = (state: ApplicationState) => state;

function* reportRead(action: RequestDocAction) {
    if (!isNaN(action.payload)) {
        const state = yield select(getStateFromStore);

        const docFromStore = state.docs.docs.get(action.payload);
        if (!docFromStore) {
            const doc = yield call(getDoc, action.payload);
            yield put(setDocInState(doc));
            getDoc(action.payload);
        }
    }
}

function* mySaga() {
    yield takeLatest(REQUEST_DOC, reportRead);
}

export default mySaga;