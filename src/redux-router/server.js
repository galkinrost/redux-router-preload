import { preload as preloadCommon } from '../server'

export const preload = (store, props) => {
    const state = store.getState()

    const routerState = state.router

    if (!routerState) {
        return Promise.resolve()
    }

    return preloadCommon(routerState.components, store, props)
}
