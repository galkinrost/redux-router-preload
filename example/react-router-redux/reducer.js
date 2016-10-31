import {combineReducers} from 'redux'
import reducer from '../../lib/react-router-redux/reducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    routing: routerReducer,
    preload: reducer
})
