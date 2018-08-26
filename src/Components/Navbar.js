import React, { Component } from 'react'
import { Route, Link, NavLink, Redirect, Switch } from 'react-router-dom'
import Home from '../Pages/Home'
import Students from '../Pages/Students'
import { logout, getSessionData } from '../Functions'

class Navbar extends Component {
  render() {
    let { firstname, lastname } = getSessionData()
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
            </ul>
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  style={{ cursor: 'pointer' }}
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Welcome, {firstname} {lastname}
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdown"
                  style={{ left: 'auto', right: 0 }}
                >
                  <a
                    style={{ cursor: 'pointer' }}
                    className="dropdown-item"
                    onClick={() => {
                      if (window.confirm('Are you sure do you want to logout?')) {
                        logout()
                        window.location.href = '/'
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
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    )
  }
}

export default Navbar
