import cheerio from 'cheerio';
import { fromJS } from 'immutable';
import initStore from './initStore';
import * as types from './actionType';

export default function(state = initStore, { type, payload }: { type: string, payload: any }) {
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
            const feedArr: Array<{ title: string; src: string; }> = [];
            const imgIndexArr: number[] = [];
            $('.article-content')
                .find('p')
                .filter((index, p) => {
                    const pText = $(p).text();
                    const isTitle = /^【\d+】/.test(pText);
                    if (isTitle) {
                        imgIndexArr.push(index + 1);
                    }
                    return isTitle || imgIndexArr.indexOf(index) !== -1;
                })
                .each((index, p) => {
                    const pText = $(p).text();
                    const isTitle = /^【\d+】/.test(pText);
                    if (isTitle) {
                        feedArr.push({ title: pText, src: '' });
                    } else {
                        feedArr[feedArr.length - 1].src = $(p).children('img').attr('src');
                    }
                });
            return state
                .setIn(['feed', 'status'], 'RESOLVE')
                .setIn(['feed', 'data'], fromJS(feedArr));
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
