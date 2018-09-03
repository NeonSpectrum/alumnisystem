import React, { Component } from 'react'
import { Route, Link, NavLink, Redirect, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Home from '../Pages/Home.page'
import Students from '../Pages/Students.page'
import IDGenerator from '../Pages/IDGenerator.page'
import IDGeneratorEdit from '../Pages/IDGenerator.edit.page'
import Logout from '../Pages/Logout.page'

import { getInfo } from '../Controllers/User.controller'

class Navbar extends Component {
  componentWillMount() {
    this.props.getInfo()
  }

  render() {
    let { data = {} } = this.props
    let { FirstName, LastName } = data
    return (
      <div className="navbar-container">
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'rgb(152,62,149)' }}>
          <Link className="navbar-brand" to="/">
            Alumni System
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarToggler"
            aria-controls="navbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarToggler">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" activeClassName="active" exact={true}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/students" activeClassName="active">
                  Students
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/id-generator" activeClassName="active">
                  ID Generator
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  style={{ cursor: 'pointer' }}
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Welcome, {FirstName} {LastName}
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdown"
                  style={{ left: 'auto', right: 0 }}
                >
                  <a
                    style={{ cursor: 'pointer' }}
                    className="dropdown-item"
                    onClick={() => {
                      if (window.confirm('Are you sure do you want to logout?')) {
                        window.location.href = '/logout'
                      }
                    }}
                  >
                    Logout
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/students" component={Students} />
            <Route path="/id-generator/:id/edit" component={IDGeneratorEdit} />
            <Route path="/id-generator" component={IDGenerator} />
            <Route path="/logout" component={Logout} />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    )
  }
}
const mapStateToProps = ({ UserReducer }) => {
  let { info } = UserReducer
  return info || {}
}

const mapDispatchToProps = {
  getInfo
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
)
