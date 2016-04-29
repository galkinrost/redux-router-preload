import {combineReducers} from 'redux'
import {reducer} from '../lib'
import {routerStateReducer} from 'redux-router'

export default combineReducers({
    router: routerStateReducer,
    preload: reducer  
})
