import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './Components/Navbar.component'
import Login from './Pages/Login.page'

import { connect } from 'react-redux'
import { BASE_NAME, validateAuth } from './Global'

class App extends Component {
  render() {
    return (
      <Router basename={BASE_NAME || '/'}>
        {sessionStorage.auth && validateAuth(JSON.parse(sessionStorage.auth)) ? <Navbar /> : <Login />}
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return state || {}
}

export default connect(mapStateToProps)(App)
