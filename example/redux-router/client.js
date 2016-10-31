import {ReduxRouter, reduxReactRouter} from 'redux-router'
import {compose, createStore} from 'redux'

import {MOUNT_ID} from './constants'
import {Provider} from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/lib/createBrowserHistory'
import reducer from './reducer'
import routes from './routes'

const store = compose(
    reduxReactRouter({createHistory})
)(createStore)(reducer, window.__initialState)

const rootComponent = (
    <Provider store={store}>
        <ReduxRouter routes={routes}/>
    </Provider>
)

const mountNode = document.getElementById(MOUNT_ID)

ReactDOM.render(rootComponent, mountNode)
