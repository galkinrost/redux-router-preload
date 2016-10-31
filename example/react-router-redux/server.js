/* eslint-env node */
/* eslint-disable  no-console */

import { RouterContext, createMemoryHistory, match } from 'react-router'

import { MOUNT_ID } from './constants'
import { Provider } from 'react-redux'
import React from 'react'
import config from './webpack.config.clientDev'
import { configureStore } from './store'
import express from 'express'
import { preload } from '../../lib/react-router-redux/server'
import { renderToString } from 'react-dom/server'
import routes from './routes'
import serialize from 'serialize-javascript'
import { syncHistoryWithStore } from 'react-router-redux'
import webpack from 'webpack'

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express()
const compiler = webpack(config)

const getMarkup = (renderProps, store) => {
    const initialState = serialize(store.getState())

    const markup = renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
    )

    return `<!doctype html>
    <html>
      <head>
        <link rel="icon" sizes="32x32" type="image/png" href="https://nodejs.org/static/favicon.png">
        <title>Redux React Router – Server rendering Example</title>
      </head>
      <body>
        <div id="${MOUNT_ID}">${markup}</div>
        <div id="devtools"></div>
        <script>window.__initialState = ${initialState}</script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `
}

const PORT = 3000
const STATUS_500 = 500
const STATUS_302 = 302
const STATUS_400 = 400
const STATUS_200 = 200

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.use((req, res) => {
    const memoryHistory = createMemoryHistory(req.url)
    const store = configureStore(memoryHistory)
    const history = syncHistoryWithStore(memoryHistory, store)

    match({history, routes, location: req.url}, (error, redirectLocation, renderProps) => {

        if (error) {
            console.error(`Router error:`, error)
            res.status(STATUS_500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(STATUS_302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            preload(renderProps, store)
                .then(() =>
                    res.status(STATUS_200)
                        .send(getMarkup(renderProps, store)))
                .catch(e => console.error(e))
        } else {
            res.status(STATUS_400).send(`Not Found`)
        }
    })
})

app.listen(PORT, `localhost`, error => {
    if (error) {
        console.log(error)
        return
    }

    console.log(`Listening at http://localhost:${PORT}`)
})
