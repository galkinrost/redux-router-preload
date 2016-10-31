import { applyMiddleware, compose, createStore } from 'redux'

import DockMonitor from 'redux-devtools-dock-monitor'
import LogMonitor from 'redux-devtools-log-monitor'
import React from 'react'

import { createDevTools } from 'redux-devtools'
import reducer from './reducer'
import { routerMiddleware } from 'react-router-redux'

export const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
        <LogMonitor theme="tomorrow" preserveScrollTop={false}/>
    </DockMonitor>
)

export function configureStore(history, initialState) {

    let devTools = []
    if (typeof document !== `undefined`) {
        devTools = [ DevTools.instrument() ]
    }

    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(
                routerMiddleware(history)
            ),
            ...devTools
        )
    )

    return store
}
