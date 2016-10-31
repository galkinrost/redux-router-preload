import {App, Child, Parent} from './components'
import React from 'react'
import {Route} from 'react-router'

export default (
  <Route path="/" component={App}>
    <Route path="parent" component={Parent}>
      <Route path="child" component={Child} />
      <Route path="child/:id" component={Child} />
    </Route>
  </Route>
)
