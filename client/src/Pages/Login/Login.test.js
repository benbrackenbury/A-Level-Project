// Login.react.test.js
import React from 'react'
import Login from './Login'
import renderer from 'react-test-renderer'

test('Login changes the class when hovered', () => {
    const component = renderer.create(
        <Login />,
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // manually trigger the callback
    tree.props.onMouseEnter()
    // re-rendering
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // manually trigger the callback
    tree.props.onMouseLeave()
    // re-rendering
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
})