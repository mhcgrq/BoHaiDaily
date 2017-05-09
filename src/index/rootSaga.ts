import { take, call, fork, cancel } from 'redux-saga/effects';
import { Task, SagaIterator } from 'redux-saga';
import { Store } from 'redux';

interface TaskList {
    [type: string]: {
        currentTask: Task | null;
        takeAll: boolean;
        saga: () => SagaIterator;
    };
}

export interface Watcher {
    type: string;
    takeAll?: boolean;
    saga: (...args: any[]) => SagaIterator;
}

export default class Saga {
    private taskList: TaskList = {};

    public injectAsyncSaga(watcherList: Watcher[]) {
        for (let i = 0, len = watcherList.length; i < len; i++) {
            this.taskList[watcherList[i].type] = {
                currentTask: null,
                saga: watcherList[i].saga,
                takeAll: watcherList[i].takeAll || false,
            };
        }
    }

    public *rootSaga(store: Store<any>) {
        while (true) {
            const { type, payload } = yield take('*');
            const taskObj = this.taskList[type];
            if (taskObj) {
                if (taskObj.takeAll) {
                    yield fork(taskObj.saga, payload, store.dispatch);
                } else {
                    yield call([this, this.cancelLastTask], type);
                    const task = yield fork(taskObj.saga, payload, store.dispatch);
                    yield call([this, this.pushLatestTask], task, type);
                }
            }
        }
    }

    private *cancelLastTask(type: keyof TaskList) {
        if (this.taskList[type].currentTask) {
            yield cancel((this.taskList[type].currentTask) as Task);
            this.taskList[type].currentTask = null;
        }
    }

    private pushLatestTask(task: Task, type: string) {
        this.taskList[type].currentTask = task;
    }
}
