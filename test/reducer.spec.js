import {ROUTER_DID_CHANGE} from 'redux-router/lib/constants'
import {SERVER_LOAD} from '../src/constants'
import expect from 'expect'
import reducer from '../src/redux-router/reducer'

describe(`redux-router-preload`, () => {
    describe(`reduxRouterReducer()`, () => {
        it(`update on the first ROUTER_DID_CHANGE action`, () => {
            const initialState = reducer()

            const action = {
                type: ROUTER_DID_CHANGE
            }

            expect(initialState.initialDidChangeDispatched).toBeFalsy()

            const resultState = reducer({loadedOnServer: true}, action)

            expect(resultState.initialDidChangeDispatched).toBeTruthy()
        })

        it(`should ignore ROUTER_DID_CHANGE if server loading didn't execute`, () => {
            const initialState = reducer()

            const action = {
                type: ROUTER_DID_CHANGE
            }

            expect(initialState.shouldReloadAfterServerPreload).toBeFalsy()

            let resultState = reducer(initialState, action)

            expect(resultState.shouldReloadAfterServerPreload).toBeFalsy()

            resultState = reducer(resultState, action)

            expect(resultState.shouldReloadAfterServerPreload).toBeFalsy()

        })

        it(`update on the server preloading`, () => {
            const initialState = reducer()

            const action = {
                type: SERVER_LOAD
            }

            expect(initialState.loadedOnServer).toBeFalsy()

            const resultState = reducer(initialState, action)

            expect(resultState.loadedOnServer).toBeTruthy()
        })

        it(`allow reloading after the second ROUTER_DID_CHANGE action`, () => {
            const initialState = reducer({
                loadedOnServer: true,
                shouldReloadAfterServerPreload: false
            })

            const action = {
                type: ROUTER_DID_CHANGE
            }

            const resultState = reducer(initialState, action)

            expect(resultState.shouldReloadAfterServerPreload).toBeFalsy()
        })

    })
})