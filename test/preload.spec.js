import React, { Component } from 'react'
import preload, { createPreload } from '../src/preload'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import { createStore } from 'redux'
import expect from 'expect'

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

const renderInContainer = ChildComponent => {
    class PropChangeContainer extends Component {
        constructor(props) {
            super(props)
            this.state = props
        }

        render() {
            return <ChildComponent {...this.state} />
        }
    }
    return PropChangeContainer
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

            const props = {
                foo: `bar`
            }

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
                    <Wrapped {...props} />
                </Provider>
            )

            expect(preloadSpy.calls.length).toEqual(1)

            expect(preloadSpy.calls[ 0 ].arguments).toEqual([ store.dispatch, store.getState(), props ])

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

            const props = {
                foo: `bar`
            }

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
                    <Wrapped {...props} />
                </Provider>
            )

            expect(preloadSpy.calls.length).toEqual(1)

            expect(preloadSpy.calls[ 0 ].arguments).toEqual([ store.dispatch, store.getState(), props ])

            const passthrough = TestUtils.findRenderedComponentWithType(tree, Passthrough)

            expect(passthrough.props.loading).toBeTruthy()

            expect(thenSpy.calls.length).toEqual(1)

            thenSpy
                .calls[ 0 ]
                .arguments[ 0 ]()

            expect(passthrough.props.loading).toBeFalsy()
        })

        it(`should call preload if the router's id has been changed`, () => {
            const TWO = 2

            const initialProps = {

                routeParams: {
                    id: 2
                },
                preloadState: {
                    loadedOnServer: false
                }
            }

            const newProps = {
                routeParams: {
                    id: 42
                }
            }

            const promiseMock = {then: expect.createSpy()}
            const preloadSpy = expect.createSpy().andReturn(promiseMock)

            const Preload = createPreload(preloadSpy, Target)
            const PropChangeContainer = renderInContainer(Preload)

            const tree = TestUtils.renderIntoDocument(
                <PropChangeContainer {...initialProps} />
            )

            expect(preloadSpy.calls.length).toEqual(1)

            const renderedPropChangeContainer = TestUtils.findRenderedComponentWithType(tree, PropChangeContainer)
            renderedPropChangeContainer.setState(newProps)

            expect(preloadSpy.calls.length).toEqual(TWO)
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

        it(`should use shouldComponentUpdate if there is one`, () => {
            const store = createStoreWithPreloadState({
                loadedOnServer: true
            })

            const shouldComponentUpdate = props => {
                const oldProps = props.prevProps.exampleProps
                const newProps = props.nextProps.exampleProps

                if (oldProps.string === newProps.string) {
                    return false
                }

                if (oldProps.number === newProps.number) {
                    return false
                }

                return true
            }

            const initialProps = {
                exampleProps: {
                    number: 42,
                    string: `on`
                }
            }

            const newProps = {
                exampleProps: {
                    number: 42,
                    string: `off`
                }
            }

            const didUpdateSpy = expect.createSpy()

            class DidUpdateChild extends Component {
                render() {
                    didUpdateSpy()
                    return <div />
                }
            }

            class Parent extends Component {
                render() {
                    return (
                        <DidUpdateChild {...this.props} />
                    )
                }
            }

            expect(didUpdateSpy.calls.length).toEqual(0)

            const preloadSpy = expect.createSpy()
            const PreloadedParent = preload(preloadSpy, shouldComponentUpdate)(Parent)
            const PropChangeContainer = renderInContainer(PreloadedParent)

            const tree = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <PropChangeContainer {...initialProps} />
                </Provider>
            )

            const renderedPropChangeContainer = TestUtils.findRenderedComponentWithType(
                tree,
                PropChangeContainer
            )

            renderedPropChangeContainer.setState(newProps)

            expect(didUpdateSpy.calls.length).toEqual(1)
        })

    })
})
