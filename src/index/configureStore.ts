import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './rootReducer';
import Saga from './rootSaga';
import watcher from '../saga/watcher';

const sagaMiddleware = createSagaMiddleware();
const middlewares: Middleware[] = [sagaMiddleware];
const composeArgs = [applyMiddleware(...middlewares)];

const store = createStore(
    createReducer({}),
    compose.apply(null, composeArgs),
);

const saga = new Saga();
sagaMiddleware.run(saga.rootSaga.bind(saga), store);

saga.injectAsyncSaga.call(saga, watcher);

export default store;
