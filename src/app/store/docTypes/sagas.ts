import { call, put, takeLeading } from 'redux-saga/effects'
import { FETCH_DOCTYPES } from './types';
import { receiveDocTypesData } from "./actions";
import { getList } from "../../services/docTypes";

function* getLabelsFromServer(action: any) {
    try {
        const data = yield call(getList);
        yield put(receiveDocTypesData(data));
    } catch (e) {
        console.log(e);
    }
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
    yield takeLeading(FETCH_DOCTYPES, getLabelsFromServer);
}

export default mySaga;