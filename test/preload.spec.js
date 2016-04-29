import React, {Component} from 'react'
import {Provider} from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import {createStore} from 'redux'
import expect from 'expect'
import preload from '../src/preload'

class Target extends Component {
    render() {
        return <Passthrough {...this.props} />
    }
}

class Passthrough extends Component {
    render() {
        return <div/>
    }
}

const createStoreWithPreloadState = state => createStore(() => ({
    preload: state
}))

describe(`redux-router-preload`, () => {
    describe(`preload()`, () => {
        it(`should call the preload method and pass loading true`, () => {
            const store = createStoreWithPreloadState({
                loadedOnServer: false
            })

            const thenSpy = expect.createSpy()

            const promiseMock = {
                then: thenSpy
            }

            const preloadSpy = expect
                .createSpy()
                .andReturn(promiseMock)

            const Wrapped = preload(preloadSpy)(Target)

            const tree = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <Wrapped />
                </Provider>
            )

            expect(preloadSpy.calls.length).toEqual(1)

            expect(preloadSpy.calls[ 0 ].arguments).toEqual([ store.dispatch, store.getState() ])

            const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough)

            expect(passthrough.props.loading).toBeTruthy()

            expect(thenSpy.calls.length).toEqual(1)

            thenSpy
                .calls[ 0 ]
                .arguments[ 0 ]()

            expect(passthrough.props.loading).toBeFalsy()
        })

        it(`should also call the preload method if location's changed`, () => {
            const store = createStoreWithPreloadState({
                loadedOnServer: true,
                shouldReloadAfterServerPreload: true
            })

            const thenSpy = expect.createSpy()

            const promiseMock = {
                then: thenSpy
            }

            const preloadSpy = expect
                .createSpy()
                .andReturn(promiseMock)

            const Wrapped = preload(preloadSpy)(Target)

            const tree = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <Wrapped />
                </Provider>
            )

            expect(preloadSpy.calls.length).toEqual(1)

            expect(preloadSpy.calls[ 0 ].arguments).toEqual([ store.dispatch, store.getState() ])

            const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough)

            expect(passthrough.props.loading).toBeTruthy()

            expect(thenSpy.calls.length).toEqual(1)

            thenSpy
                .calls[ 0 ]
                .arguments[ 0 ]()

            expect(passthrough.props.loading).toBeFalsy()
        })

        it(`should not call the preload method if it's already called on the server`, () => {
            const store = createStoreWithPreloadState({
                loadedOnServer: true
            })

            const preloadSpy = expect.createSpy()

            const Wrapped = preload(preloadSpy)(Target)

            const tree = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <Wrapped />
                </Provider>
            )

            expect(preloadSpy.calls.length).toEqual(0)

            const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough)

            expect(passthrough.props.loading).toBeFalsy()
        })

        it(`should throw error if the preload method doesn't return promise`, () => {
            const store = createStoreWithPreloadState({})

            const preloadSpy = expect
                .createSpy()
                .andReturn(undefined)

            const Wrapped = preload(preloadSpy)(Target)

            expect(() => {
                TestUtils.renderIntoDocument(
                    <Provider store={store}>
                        <Wrapped />
                    </Provider>
                )
            }).toThrow(/first argument of the preload decorator should return a promise/)
        })

        it(`should transclude children`, () => {
            const store = createStoreWithPreloadState({
                loadedOnServer: true
            })

            class Container extends Component {
                render() {
                    return this.props.children
                }
            }

            const Wrapped = preload()(Container)

            const tree = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <Wrapped>
                        <Passthrough />
                    </Wrapped>
                </Provider>
            )


            const result = TestUtils.scryRenderedComponentsWithType(tree, Passthrough)

            expect(result.length).toEqual(1)
        })
    })
})