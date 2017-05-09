import { combineReducers } from 'redux-immutable';
import { Reducer } from 'redux';
import root from '../redux/reducer';

interface ReducerList {
    [index: string]: Reducer<any>;
}

let reducersList: ReducerList = {
    root,
};

export default function createReducer(asyncReducers: ReducerList) {
    asyncReducers
    && !reducersList[Object.keys(asyncReducers)[0]]
    && (reducersList = Object.assign({}, reducersList, asyncReducers));
    return combineReducers(reducersList);
}
