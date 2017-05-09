import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './rootReducer';
import Fetch from '../../../xjs-public/Fetch/Fetch';
import Saga from './rootSaga';
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
const composeArgs = [applyMiddleware(...middlewares)];
const store = createStore(createReducer({}), compose.apply(null, composeArgs));
export const fetch = new Fetch(store.dispatch);
const saga = new Saga();
sagaMiddleware.run(saga.rootSaga.bind(saga), store);
export default store;
//# sourceMappingURL=configureStore.js.map