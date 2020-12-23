import createSagaMiddleware from "redux-saga";
import labelSaga from "./labels/sagas";
import statusesSaga from "./statuses/sagas";
import milestoneSaga from "./milestones/sagas";
import shortcutSaga from "./shortcuts/sagas";
import refreshShortcutSaga from "./shortcuts/refreshShortctsData";
import docTypeSaga from "./docTypes/sagas";
import receiveCommentsSaga from "./comments/receiveCommentsSaga";
import loadunReadCommentNumbersSaga from "./comments/loadunReadCommentsNumberSaga";
import loadReadCommentsSaga from "./comments/loadReadCommentsSaga";
import loadUnreadCommentsSaga from "./comments/loadunReadCommentsSaga";
import usersSaga from "./users/sagas";
import requestDocSaga from "./docs/requestDocSaga";
import currentUserSaga from "./currentuser/sagas";
import reportDocReadSaga from "./docs/reportDocReadSaga";
import loadShortcutDocsSaga from "./shortcuts/loadShortcutDocs";
const sagaMiddleware = createSagaMiddleware();

export const initSagas = () => {
    sagaMiddleware.run(requestDocSaga);
    sagaMiddleware.run(receiveCommentsSaga);
    sagaMiddleware.run(loadunReadCommentNumbersSaga);
    sagaMiddleware.run(loadUnreadCommentsSaga);
    sagaMiddleware.run(loadReadCommentsSaga);
    sagaMiddleware.run(reportDocReadSaga);
    sagaMiddleware.run(labelSaga);
    sagaMiddleware.run(labelSaga);
    sagaMiddleware.run(docTypeSaga);
    sagaMiddleware.run(statusesSaga);
    sagaMiddleware.run(milestoneSaga);
    sagaMiddleware.run(shortcutSaga);
    sagaMiddleware.run(refreshShortcutSaga);
    sagaMiddleware.run(loadShortcutDocsSaga);
    sagaMiddleware.run(currentUserSaga);
    sagaMiddleware.run(usersSaga);
}
export default sagaMiddleware;
