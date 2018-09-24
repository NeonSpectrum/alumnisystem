import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { logout } from '../Controllers/User.controller'

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logging: true
    }
  }
  componentDidMount() {
    this.props.logout()
    this.setState({
      logging: false
    })
  }

  render() {
    return this.state.logging ? <div>Logging out...</div> : <Redirect to="/login" />
  }
}

const mapDispatchToProps = {
  logout
}

export default connect(
  null,
  mapDispatchToProps
)(Logout)
