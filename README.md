# redux-router-preload [![Build Status](https://travis-ci.org/babotech/redux-router-preload.svg?branch=master)](https://travis-ci.org/babotech/redux-router-preload)

Universal preloading for [redux-router](https://github.com/acdlite/redux-router)

## Installing

```
npm install --save redux-router-preload
```

## Integration


**Reducer:**
```javascript
import {combineReducers} from 'redux'
import {reducer} from 'redux-router'
import {routerStateReducer} from 'redux-router-preload'

export default combineReducers({
    router: routerStateReducer,
    preload: reducer  
})
```

**Components:**
```javascript
@preload(() => new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT)))
class ComponentWithPreloading extends Component {
  render() {
    const {loading} = this.props
  
    ...
  }
}
```

**Server:**
```javascript
...
import {preload} from 'redux-router-preload/server'

const store = reduxReactRouter({routes, createHistory: createMemoryHistory})(createStore)(reducer)
const query = qs.stringify(req.query)
const url = `${req.path}${query.length ? `?${query}` : ``}`

store.dispatch(match(url, (error, redirectLocation, routerState) => {

    if (error) {
        console.error(`Router error:`, error)
        res.status(STATUS_500).send(error.message)
    } else if (redirectLocation) {
        res.redirect(STATUS_302, redirectLocation.pathname + redirectLocation.search)
    } else if (routerState) {
        preload(store)
            .then(() =>
                res.status(STATUS_200)
                    .send(getMarkup(store)))
    } else {
        res.status(STATUS_400).send(`Not Found`)
    }
}))
```

## Test

```
npm test
```

## License

**MIT**
