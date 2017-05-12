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
export function requestFeedNextPage() {
    return { type: types.FEED_NEXT_PAGE_SAGA };
}
export function swtichImageStatus(imgSrc, status) {
    return {
        type: types.SWITCH_IMAGE_STATUS,
        payload: { imgSrc, status },
    };
}
//# sourceMappingURL=action.js.map