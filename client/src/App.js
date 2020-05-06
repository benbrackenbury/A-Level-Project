import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import './app.css'
import { app_title } from './config'

import Home from './Pages/Home/Home'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Feed from './Pages/Feed/Feed'
import Upload from './Pages/Upload/Upload'
import User from './Pages/User/User'
import Category from './Pages/Category/Category'

const cookies = new Cookies()

const logout = () => {
  cookies.remove('user')
  window.location = '/'
}

const upload = () => {
  window.location = '/upload'
}

const loggedInLogic = () => {
  if (!cookies.get('user')) return (
    <>
      <li><Link className="nav-link" to="/signup"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
      <li><Link className="nav-link" to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
    </>
  )
  else return (
    <>
      <li><button className="btn btn-primary" id="upload_btn" onClick={upload}><span className="glyphicon glyphicon-plus"></span> Upload</button></li>
      <li><button className="nav-link" id="profile_btn" onClick={() => { window.location = '/user' }}><span className="glyphicon glyphicon-user"></span> My Profile</button></li>
      <li><button className="nav-link" id="logout_btn" onClick={logout}><span className="glyphicon glyphicon-log-in"></span> Log Out</button></li>
    </>
  )
}

export default class App extends Component {
  render() {
    return (
      <div>

        <nav className="navbar navbar-toggleable-md navbar-dark">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon glyphicon glyphicon-menu-hamburger"></span>
          </button>
          <Link className="navbar-brand" to="/">{app_title}</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            <ul className="nav navbar-nav navbar-right">
              {loggedInLogic()}
            </ul>
          </div>
        </nav>

        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Switch id="switch">
            <Route exact path='/' component={Home} />
            <Route path='/user' component={User} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Register} />
            <Route path='/feed' component={Feed} />
            <Route path='/upload' component={Upload} />
            <Route path='/user' component={User} />
            <Route path='/category' component={Category} />
          </Switch>
        </div>

      </div >
    )
  }
}