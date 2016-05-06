import {LOADER_FIELD, SERVER_LOAD} from './constants'
import invariant from 'invariant'

export const preload = (store, props) => {
    const state = store.getState()

    const routerState = state.router

    if (!routerState) {
        return Promise.resolve()
    }

    const promises = routerState
        .components
        .map(component => component[ LOADER_FIELD ])
        .filter(preloadMethod => preloadMethod)
        .map(preloadMethod => {
            const promise = preloadMethod(store.dispatch, state, props)
            invariant(promise && promise.then, `first argument of the preload decorator should return a promise`)
            return promise
        })

    store.dispatch({
        type: SERVER_LOAD
    })

    return Promise.all(promises)
}