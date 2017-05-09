import { combineReducers } from 'redux-immutable';
import root from '../redux/reducer';
let reducersList = {
    root,
};
export default function createReducer(asyncReducers) {
    asyncReducers
        && !reducersList[Object.keys(asyncReducers)[0]]
        && (reducersList = Object.assign({}, reducersList, asyncReducers));
    return combineReducers(reducersList);
}
//# sourceMappingURL=rootReducer.js.map