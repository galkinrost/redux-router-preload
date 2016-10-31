import { LOCATION_CHANGE } from 'react-router-redux/lib/reducer'
import createReducer from '../createReducer'

const routerPreloadStateReducer = createReducer(LOCATION_CHANGE)

export default routerPreloadStateReducer
