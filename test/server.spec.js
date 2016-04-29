import {LOADER_FIELD} from '../src/constants'
import expect from 'expect'
import {preload} from '../src/server'

describe(`redux-router`, () => {
    describe(`server`, () => {
        it(`should call preload methods for components`, () => {
            const preloadSpy1 = expect.createSpy().andReturn(Promise.resolve())
            const preloadSpy2 = expect.createSpy().andReturn(Promise.resolve())

            const stateMock = {
                router: {
                    components: [
                        {
                            [LOADER_FIELD]: preloadSpy1
                        },
                        {},
                        {
                            [LOADER_FIELD]: preloadSpy2
                        }
                    ]
                }
            }

            const getStateSpy = expect
                .createSpy()
                .andReturn(stateMock)

            const storeMock = {
                getState: getStateSpy,
                dispatch: () => ({})
            }

            const result = preload(storeMock)

            expect(result.then).toExist()

            expect(getStateSpy.call.length).toEqual(1)

            expect(preloadSpy1.calls.length).toEqual(1)
            expect(preloadSpy1.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock ])

            expect(preloadSpy2.calls.length).toEqual(1)
            expect(preloadSpy2.calls[ 0 ].arguments).toEqual([ storeMock.dispatch, stateMock ])
        })

        it(`should throw error if someone preload method doesn't return promise`, () => {
            const stateMock = {
                router: {
                    components: [
                        {
                            [LOADER_FIELD]: () => undefined
                        }
                    ]
                }
            }

            const storeMock = {
                getState: () => stateMock
            }

            expect(() => {
                preload(storeMock)
            }).toThrow(/first argument of the preload decorator should return a promise/)
        })
    })
})