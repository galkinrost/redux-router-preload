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
import {preload} from 'redux-router-preload'

@preload(() => new Promise(resolve => setTimeout(resolve, 3000)))
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

## Example

You can look for a working example [here](https://github.com/babotech/redux-router-preload/tree/master/example)

## Test

```
npm test
```

## How does it work?

The key concept of the redux-router is to store information about current location in the redux`s store. So when transitions perform store is updated by actions.

This module adds information in the store when preloading was executed on the server and prevent loading on the client. 

But after first changing of the location client loading is available again.

## License

**MIT**
