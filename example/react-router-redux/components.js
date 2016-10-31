import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { preload } from '../../lib'

const PROMISE_TIMEOUT = 5000

@preload(() => new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT)))
@connect(state => ({routerState: state.router}))
export class App extends Component {

    render() {
        // Display is only used for rendering, its not a property of <Link>
        const links = [
            {pathname: `/`, display: `/`},
            {pathname: `/parent`, query: {foo: `bar`}, display: `/parent?foo=bar`},
            {pathname: `/parent/child`, query: {bar: `baz`}, display: `/parent/child?bar=baz`},
            {pathname: `/parent/child/123`, query: {baz: `foo`}, display: `/parent/child/123?baz=foo`}
        ].map((l, i) =>
            <p key={i}>
                <Link to={l}>{l.display}</Link>
            </p>
        )

        const {loading} = this.props
        return (
            <div>
                <h1>App Container {loading ? `Loading...` : `` }</h1>
                {links}
                {this.props.children}
            </div>
        )
    }
}

@preload(() => new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT)))
export class Parent extends Component {
    render() {

        const {loading} = this.props

        return (
            <div>
                <h2>Parent {loading ? `Loading...` : `` }</h2>
                {this.props.children}
            </div>
        )
    }
}

@preload(() => new Promise(resolve => setTimeout(resolve, PROMISE_TIMEOUT)))
export class Child extends Component {


    render() {
        const {params: {id}, loading} = this.props

        return (
            <div>
                <h2>Child {loading ? `Loading...` : `` }</h2>
                {id && <p>{id}</p>}
            </div>
        )
    }
}

