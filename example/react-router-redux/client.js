import { DevTools, configureStore } from './store'
import { Router, browserHistory } from 'react-router'

import { MOUNT_ID } from './constants'
import { Provider } from 'react-redux'
import React from 'react'
import { render } from 'react-dom'
import routes from './routes'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore(browserHistory, window.__initialState)
const history = syncHistoryWithStore(browserHistory, store)

render(
    <Provider store={store}>
        <Router history={history} routes={routes}/>
    </Provider>,
    document.getElementById(MOUNT_ID)
)

render(
    <Provider store={store}>
        <DevTools/>
    </Provider>,
    document.getElementById(`devtools`)
)
