import { put, call } from 'redux-saga/effects';
import * as api from '../api/api';
import get from '../fetch/fetch';
import * as types from '../redux/actionType';

export function* getTimeLine({ page = 1 }) {
    try {
        const res = yield call(get, api.feeds(page + 1));
        yield put({
            type: types.RESOLVE_TIMELINE,
            payload: { res },
        });
    } catch (err) {
        console.log('err: ', err);
        yield put({ type: types.REJECT_TIMELINE });
    }
}

export function* getFeed({ href }: { href: string }) {
    try {
        const res = yield call(get, href);
        yield put({
            type: types.RESOLVE_FEED,
            payload: { res },
        });
    } catch (err) {
        yield put({ type: types.REJECT_FEED });
    }
}
