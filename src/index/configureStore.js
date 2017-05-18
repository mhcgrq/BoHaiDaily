import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'remote-redux-devtools';
import createReducer from './rootReducer';
import Saga from './rootSaga';
import watcher from '../saga/watcher';
// import { throttleRequestFeedNextPage } from '../saga/saga';
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeEnhancers = composeWithDevTools({ realtime: true, hostname: '192.168.1.233', port: 5000 });
const composeArgs = [composeEnhancers(applyMiddleware(...middlewares))];
const store = createStore(createReducer({}), compose.apply(null, composeArgs));
const saga = new Saga();
sagaMiddleware.run(saga.rootSaga.bind(saga), store);
saga.injectAsyncSaga.call(saga, watcher);
// sagaMiddleware.run(throttleRequestFeedNextPage);
export default store;
//# sourceMappingURL=configureStore.js.map