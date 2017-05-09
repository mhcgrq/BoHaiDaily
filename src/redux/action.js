import * as types from './actionType';
export function getTimeline(page) {
    return {
        type: types.REQUEST_TIMELINE,
        payload: { page },
    };
}
export function getFeed(id) {
    return {
        type: types.REQUEST_FEED,
        payload: { id },
    };
}
//# sourceMappingURL=action.js.map