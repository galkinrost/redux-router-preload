import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants'
import createReducer from '../createReducer'

const routerPreloadStateReducer = createReducer(ROUTER_DID_CHANGE)

export default routerPreloadStateReducer
