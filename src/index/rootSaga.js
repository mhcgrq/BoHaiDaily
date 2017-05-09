import { take, call, fork, cancel } from 'redux-saga/effects';
export default class Saga {
    constructor() {
        this.taskList = {};
    }
    injectAsyncSaga(watcherList) {
        for (let i = 0, len = watcherList.length; i < len; i++) {
            this.taskList[watcherList[i].type] = {
                currentTask: null,
                saga: watcherList[i].saga,
                takeAll: watcherList[i].takeAll || false,
            };
        }
    }
    *rootSaga(store) {
        while (true) {
            const { type, payload } = yield take('*');
            const taskObj = this.taskList[type];
            if (taskObj) {
                if (taskObj.takeAll) {
                    yield fork(taskObj.saga, payload, store.dispatch);
                }
                else {
                    yield call([this, this.cancelLastTask], type);
                    const task = yield fork(taskObj.saga, payload, store.dispatch);
                    yield call([this, this.pushLatestTask], task, type);
                }
            }
        }
    }
    *cancelLastTask(type) {
        if (this.taskList[type].currentTask) {
            yield cancel((this.taskList[type].currentTask));
            this.taskList[type].currentTask = null;
        }
    }
    pushLatestTask(task, type) {
        this.taskList[type].currentTask = task;
    }
}
//# sourceMappingURL=rootSaga.js.map