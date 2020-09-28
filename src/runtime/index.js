import {resetContext} from "kea";
import accessorsPlugin from "./accessorsPlugin"
import produce from "immer";

resetContext({
    plugins: [
        accessorsPlugin.plugin
    ]
});

export const useAccessors = accessorsPlugin.useAccessors

export const immerify = reducer => (state, payload) => {
    const nextState = produce(state, draftState => {
        return reducer(draftState, payload);
    })
    return nextState
}