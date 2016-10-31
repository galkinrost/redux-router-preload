import { preload as preloadCommon } from '../server'

export const preload = (routerProps, store, props) => {
    return preloadCommon(routerProps.routes.map(route => route.component), store, props)
}
