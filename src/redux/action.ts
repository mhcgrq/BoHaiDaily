import * as types from './actionType';

export function getTimeline(page: number) {
    return {
        type: types.REQUEST_TIMELINE,
        payload: { page },
    };
}

export function getFeed(href: string) {
    return {
        type: types.REQUEST_FEED,
        payload: { href },
    };
}

export function navOpenFeed(title: string, href: string) {
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

export function swtichImageStatus(cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') {
    return {
        type: types.SWITCH_IMAGE_STATUS,
        payload: { cellIndex, imageIndex, status },
    };
}

export function hasUpdatedFeed() {
    return { type: types.FEED_HAS_UPDATED };
}
