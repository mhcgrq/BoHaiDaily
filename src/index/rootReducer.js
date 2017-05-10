import { combineReducers } from 'redux-immutable';
import root from '../redux/reducer';
import nav from '../redux/navReducer';
let reducersList = {
    root,
    nav,
};
export default function createReducer(asyncReducers) {
    asyncReducers
        && !reducersList[Object.keys(asyncReducers)[0]]
        && (reducersList = Object.assign({}, reducersList, asyncReducers));
    return combineReducers(reducersList);
}
//# sourceMappingURL=rootReducer.js.map