import { LOADER_FIELD, SERVER_LOAD } from '../src/constants'
import expect from 'expect'
import { preload } from '../src/server'

describe(`redux-router`, () => {
    describe(`server`, () => {
        it(`should call preload methods for components and dispatch action`, () => {
            const preloadSpy1 = expect.createSpy().andReturn(Promise.resolve())
            const preloadSpy2 = expect.createSpy().andReturn(Promise.resolve())

            const stateMock = {
                router: {}
            }

            const components = [
                {
                    [LOADER_FIELD]: preloadSpy1
                },
                {},
                {
                    [LOADER_FIELD]: preloadSpy2
                }
            ]

            const dispatchSpy = expect.createSpy()

            const getStateSpy = expect
                .createSpy()
                .andReturn(stateMock)

            const storeMock = {
                getState: getStateSpy,
                dispatch: dispatchSpy
            }

            const props = {
                foo: `bar`
            }

            const result = preload(components, storeMock, props)

            expect(result.then).toExist()

            expect(getStateSpy.call.length).toEqual(1)

            expect(preloadSpy1.calls.length).toEqual(1)
            expect(preloadSpy1.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock, props ])

            expect(preloadSpy2.calls.length).toEqual(1)
            expect(preloadSpy2.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock, props ])

            expect(dispatchSpy.calls.length).toEqual(1)
            expect(dispatchSpy.calls[ 0 ].arguments[ 0 ]).toEqual({
                type: SERVER_LOAD
            })
        })

        it(`should skip undefined components`, () => {
            const preloadSpy1 = expect.createSpy().andReturn(Promise.resolve())
            const preloadSpy2 = expect.createSpy().andReturn(Promise.resolve())

            const stateMock = {
                router: {}
            }

            const components = [
                undefined,
                {
                    [LOADER_FIELD]: preloadSpy1
                },
                undefined,
                {},
                undefined,
                {
                    [LOADER_FIELD]: preloadSpy2
                },
                undefined
            ]

            const dispatchSpy = expect.createSpy()

            const getStateSpy = expect
                .createSpy()
                .andReturn(stateMock)

            const storeMock = {
                getState: getStateSpy,
                dispatch: dispatchSpy
            }

            const props = {
                foo: `bar`
            }

            const result = preload(components, storeMock, props)

            expect(result.then).toExist()

            expect(getStateSpy.call.length).toEqual(1)

            expect(preloadSpy1.calls.length).toEqual(1)
            expect(preloadSpy1.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock, props ])

            expect(preloadSpy2.calls.length).toEqual(1)
            expect(preloadSpy2.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock, props ])

            expect(dispatchSpy.calls.length).toEqual(1)
            expect(dispatchSpy.calls[ 0 ].arguments[ 0 ]).toEqual({
                type: SERVER_LOAD
            })
        })

        it(`should throw error if someone preload method doesn't return promise`, () => {
            const stateMock = {
                router: {
                }
            }

            const components = [
                {
                    [LOADER_FIELD]: () => undefined
                }
            ]

            const storeMock = {
                getState: () => stateMock
            }

            expect(() => {
                preload(components, storeMock)
            }).toThrow(/first argument of the preload decorator should return a promise/)
        })
    })
})
