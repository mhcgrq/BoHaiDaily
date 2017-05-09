import initStore from './initStore';

export default function(state = initStore, { type, payload }: { type: string, payload: any }) {
    switch (type) {
        default: {
            return state;
        }
    }
}