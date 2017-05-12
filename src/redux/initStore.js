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
        visibleData: [],
        page: 1,
    },
});
//# sourceMappingURL=initStore.js.map