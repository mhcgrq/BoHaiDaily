import { NavigationActions, NavigationNavigateAction } from 'react-navigation';
import { Navigator } from '../ui/scene/App';
import * as types from './actionType';

const firstAction = Navigator.router.getActionForPathAndParams('TimeLine') as NavigationNavigateAction;
export const initNavState = Navigator.router.getStateForAction(firstAction);

export default function nav(state = initNavState, { type, payload }: { type: string, payload: any }) {
    let nextState;
    switch (type) {
        case types.NAV_BACK:
        case 'Navigation/BACK':
            nextState = Navigator
                .router
                .getStateForAction(NavigationActions.back(), state);
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
            break;
    }
    return nextState || state;
}
