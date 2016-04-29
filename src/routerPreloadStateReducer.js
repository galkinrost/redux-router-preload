import {ROUTER_DID_CHANGE} from 'redux-router/lib/constants'
import {SERVER_LOAD} from './constants'

const initialState = {
    loadedOnServer: false,
    shouldReloadAfterServerPreload: false,
    initialDidChangeDispatched: false
}

const routerPreloadStateReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case ROUTER_DID_CHANGE:
            if (!state.loadedOnServer) {
                return state
            }

            if (state.initialDidChangeDispatched) {
                return {
                    ...state,
                    shouldReloadAfterServerPreload: true
                }
            }

            return {
                ...state,
                initialDidChangeDispatched: true
            }

        case SERVER_LOAD:
            return {
                ...state,
                loadedOnServer: true
            }

        default:
            return state
    }
}

export default routerPreloadStateReducer