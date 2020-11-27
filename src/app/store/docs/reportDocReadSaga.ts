import { reportDocReadToServer } from 'app/services/docs';
import { takeLatest } from 'redux-saga/effects'
import { ReportDocReadAction, REPORT_DOC_READ } from '../shortcuts/types';

function* reportRead(action: ReportDocReadAction) {
    reportDocReadToServer(action.payload);
}

function* mySaga() {
    yield takeLatest(REPORT_DOC_READ, reportRead);
}

export default mySaga;