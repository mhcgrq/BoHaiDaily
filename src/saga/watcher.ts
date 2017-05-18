import * as saga from './saga';
import * as types from '../redux/actionType';

const watcher = [
    {
        type: types.REQUEST_TIMELINE,
        saga: saga.getTimeLine,
    },
    {
        type: types.REQUEST_FEED,
        saga: saga.getFeed,
    },
    {
        type: types.FEED_NEXT_PAGE_SAGA,
        saga: saga.requestFeedNextPage,
    }
];

export default watcher;
