import { NavigationActions } from 'react-navigation';
import { Navigator } from '../ui/App';
import * as types from './actionType';

const firstAction = Navigator.router.getActionForPathAndParams('TimeLine');
export const initNavState = Navigator.router.getStateForAction(firstAction);

export default function nav(state = initNavState, { type, payload }: { type: string, payload: any }) {
    let nextState;
    switch (type) {
        case types.NAV_BACK:
            nextState = Navigator
                .router
                .getStateForAction(NavigationActions.back({ key: 'TimeLine' }), state);
            break;
        case types.NAV_OPEN_FEED:
            nextState = Navigator
                .router
                .getStateForAction(
                    NavigationActions.navigate({
                        routeName: 'Feed',
                        params: { ...payload },
                    }),
                    state,
                );
            break;
        default:
            // nextState = Navigator
            //     .router
            //     .getStateForAction({ type }, state);
            break;
    }
    return nextState || state;
}
