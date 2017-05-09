import * as types from './actionType';

export function getTimeline(page: number) {
    return {
        type: types.REQUEST_TIMELINE,
        payload: { page },
    };
}

export function getFeed(id: string) {
    return {
        type: types.REQUEST_FEED,
        payload: { id },
    };
}
