import cheerio from 'cheerio';
import { fromJS } from 'immutable';
import initStore from './initStore';
import * as types from './actionType';
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
                href: $(header).attr('a'),
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
            const feedArr = $('.article-content')
                .find('p')
                .map((_, p) => {
                let title = '';
                let href = '';
                const isTitle = $(p).has('.img');
                if (isTitle) {
                    title = $(p).text();
                }
                else {
                    href = $(p).children('img').attr('src');
                }
            })
                .get();
            return state
                .setIn(['timeline', 'status'], 'RESOLVE')
                .setIn(['timeline', 'data'], fromJS(feedArr));
        }
        case types.REJECT_TIMELINE: {
            return state.setIn(['timeline', 'status'], 'REJECT');
        }
        case types.REJECT_FEED: {
            return state.setIn(['feed', 'status'], 'REJECT');
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=reducer.js.map