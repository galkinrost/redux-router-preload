import {SERVER_LOAD} from './constants'

export const initialState = {
    loadedOnServer: false,
    shouldReloadAfterServerPreload: false,
    initialDidChangeDispatched: false
}

const routerPreloadStateReducer = LOCATION_CHANGE_ACTION => (state = initialState, action = {}) => {
    switch (action.type) {

        case LOCATION_CHANGE_ACTION:
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
