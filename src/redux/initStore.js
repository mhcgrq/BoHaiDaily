import { fromJS } from 'immutable';
export default fromJS({
    timeline: {
        status: 'REQUEST',
        currentPage: 1,
        data: [],
    },
    feed: {
        status: 'REQUEST',
        title: '',
        data: [],
    },
});
//# sourceMappingURL=initStore.js.map