import { put, call, throttle } from 'redux-saga/effects';
import * as api from '../api/api';
import get from '../fetch/fetch';
import * as types from '../redux/actionType';

export function* getTimeLine({ page = 1 }) {
    try {
        const res = yield call(get, api.feeds(page));
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

export function* requestFeedNextPage() {
    yield put({ type: types.FEED_NEXT_PAGE });
}

export function* throttleRequestFeedNextPage() {
    yield throttle(1000, types.FEED_NEXT_PAGE_SAGA, requestFeedNextPage);
}
