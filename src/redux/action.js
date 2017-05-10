import * as types from './actionType';
export function getTimeline(page) {
    return {
        type: types.REQUEST_TIMELINE,
        payload: { page },
    };
}
export function getFeed(href) {
    return {
        type: types.REQUEST_FEED,
        payload: { href },
    };
}
export function navOpenFeed(title, href) {
    return {
        type: types.NAV_OPEN_FEED,
        payload: { title, href },
    };
}
export function navBack() {
    return { type: types.NAV_BACK };
}
//# sourceMappingURL=action.js.map