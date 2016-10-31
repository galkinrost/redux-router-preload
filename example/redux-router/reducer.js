import { combineReducers } from 'redux'
import reducer from '../../lib/redux-router/reducer'
import { routerStateReducer } from 'redux-router'

export default combineReducers({
    router: routerStateReducer,
    preload: reducer
})
