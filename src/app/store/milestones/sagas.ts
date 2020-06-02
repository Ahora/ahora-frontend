import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_MILESTONES } from './types';
import { receiveMilestonesData } from "./actions";
import { getMilestones } from "../../services/OrganizationMilestones";

function* getMilestonesFromServer(action: any) {
    try {
        const data = yield call(getMilestones);
        yield put(receiveMilestonesData(data));
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
    yield takeLatest(FETCH_MILESTONES, getMilestonesFromServer);
}

export default mySaga;