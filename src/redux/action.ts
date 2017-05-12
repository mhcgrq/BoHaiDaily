import * as types from './actionType';
import { LoadStatus } from '../ui/component/Picture';

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

export function swtichImageStatus(imgSrc: string, status: LoadStatus) {
    return {
        type: types.SWITCH_IMAGE_STATUS,
        payload: { imgSrc, status },
    };
}
