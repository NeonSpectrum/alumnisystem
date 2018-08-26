import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Login from './Pages/Login'

import { connect } from 'react-redux'
import { validateAuth } from './Functions'

class App extends Component {
  render() {
    return <Router>{sessionStorage.auth && validateAuth(sessionStorage.auth) ? <Navbar /> : <Login />}</Router>
  }
}

const mapStateToProps = state => {
  return state || {}
}

export default connect(mapStateToProps)(App)
