import React, { Component } from 'react'
import { connect } from 'react-redux'

import { logout } from '../Controllers/User.controller'

class Logout extends Component {
  componentDidMount() {
    this.props.logout()
    window.location.href = '/login'
  }

  render() {
    return <div>Logging out...</div>
  }
}

const mapDispatchToProps = {
  logout
}

export default connect(
  null,
  mapDispatchToProps
)(Logout)
