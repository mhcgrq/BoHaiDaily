import cheerio from 'cheerio';
import { fromJS } from 'immutable';
import initStore from './initStore';
import * as types from './actionType';
const OFFSET = 2;
export default function (state = initStore, { type, payload }) {
    switch (type) {
        case types.REQUEST_TIMELINE: {
            return state.setIn(['timeline', 'status'], 'REQUEST');
        }
        case types.REQUEST_FEED: {
            return state.setIn(['feed', 'status'], 'REQUEST');
        }
        case types.RESOLVE_TIMELINE: {
            const res = payload.res;
            const $ = cheerio.load(res);
            const headerArr = $('.content')
                .find('article header a')
                .map((_, header) => ({
                href: $(header).attr('href'),
                title: $(header).text(),
            }))
                .get();
            return state
                .setIn(['timeline', 'status'], 'RESOLVE')
                .setIn(['timeline', 'data'], fromJS(headerArr));
        }
        case types.RESOLVE_FEED: {
            const res = payload.res;
            const $ = cheerio.load(res);
            const feedArr = [];
            $('.article-content')
                .find('p')
                .each((_, p) => {
                const pText = $(p).text();
                const isTitle = /^【\d+】/.test(pText);
                if (isTitle) {
                    const feed = { title: pText, src: [] };
                    let nextP = $(p).next();
                    while ($(nextP).children().is('img')) {
                        const src = $(nextP).children('img').attr('src');
                        feed.src.push({ src, status: 'REQUEST' });
                        nextP = nextP.next();
                    }
                    feedArr.push(feed);
                }
            });
            return state
                .setIn(['feed', 'status'], 'RESOLVE')
                .setIn(['feed', 'visibleData'], fromJS(feedArr.slice(0, OFFSET)))
                .setIn(['feed', 'data'], fromJS(feedArr));
        }
        case types.FEED_NEXT_PAGE: {
            const currentPage = state.getIn(['feed', 'page']);
            const data = state.getIn(['feed', 'data']);
            let currentVisibleData = state.getIn(['feed', 'visibleData']);
            // const isAllResolved = currentVisibleData.every((item: any) => {
            //     return item.get('src')
            //         .every((s: any) => s.get('status') === 'RESOLVE');
            // });
            // if (!isAllResolved) {
            //     return state;
            // }
            const hasUpdated = state.getIn(['feed', 'hasUpdated']);
            if (!hasUpdated) {
                return state;
            }
            const newData = data.slice(currentPage * OFFSET, (currentPage + 1) * OFFSET);
            if (newData.size > 0) {
                currentVisibleData = currentVisibleData.concat(newData);
                return state
                    .setIn(['feed', 'page'], currentPage + 1)
                    .setIn(['feed', 'visibleData'], currentVisibleData)
                    .setIn(['feed', 'hasUpdated'], false);
            }
            return state;
        }
        case types.FEED_HAS_UPDATED: {
            return state.setIn(['feed', 'hasUpdated'], true);
        }
        case types.SWITCH_IMAGE_STATUS: {
            const { cellIndex, imageIndex, status } = payload;
            return state.setIn(['feed', 'visibleData', cellIndex, 'src', imageIndex, 'status'], status);
        }
        case types.REJECT_TIMELINE: {
            return state.setIn(['timeline', 'status'], 'REJECT');
        }
        case types.REJECT_FEED: {
            return state.setIn(['feed', 'status'], 'REJECT');
        }
        case types.NAV_BACK:
        case 'Navigation/BACK': {
            return state.set('feed', initStore.get('feed'));
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=reducer.js.map