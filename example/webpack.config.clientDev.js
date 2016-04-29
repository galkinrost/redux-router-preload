/* eslint-env node */
import {
    HotModuleReplacementPlugin,
    NoErrorsPlugin
} from 'webpack'

import path from 'path'

const clientDevConfig = {
    entry: [
        `webpack-hot-middleware/client`,
        `./client`
    ],
    output: {
        path: path.resolve(__dirname, `build`),
        filename: `bundle.js`,
        publicPath: `/static/`
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new NoErrorsPlugin()
    ],
    devtool: `eval`,
    module: {
        loaders: [ {
            test: /\.js$/,
            loader: `babel`,
            exclude: /node_modules/,
            include: [
                path.resolve(__dirname)
            ]
        } ]
    },
    resolve: {
        extensions: [ ``, `.js` ]
    }
}

export default clientDevConfig
