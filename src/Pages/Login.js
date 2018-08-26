import React, { Component } from 'react'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import { fetchJSON } from '../Functions'

import Register from './Register'
import CustomInput from '../Components/CustomInput'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logging: false,
      username: null,
      password: null,
      error: {
        visible: false,
        text: ''
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loginPage = this.loginPage.bind(this)
    this.init = window.init
    this.props.history.listen((location, action) => {
      this.init()
    })
  }

  componentDidMount() {
    this.init()
  }

  async handleSubmit(e) {
    e.preventDefault()

    let { username, password } = this.state
    this.setState({ logging: true })

    try {
      let data = await fetchJSON('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        })
      })

      if (data.success) {
        sessionStorage.auth = data.token
        window.location.href = '/'
      } else {
        this.setState({
          logging: false,
          error: {
            visible: true,
            text: 'Invalid Username and/or Password!'
          }
        })
      }
    } catch (err) {
      this.setState({
        logging: false,
        error: {
          visible: true,
          text: err
        }
      })
    }
  }

  handleChange(e) {
    let { name, value } = e.target
    this.setState({
      [name]: value,
      error: {
        visible: false,
        text: ''
      }
    })
  }

  loginPage() {
    const { logging, username, password, error } = this.state
    return (
      <form className="form card-form p-5" onSubmit={this.handleSubmit}>
        <h3 className="text-center text-info">Login Form</h3>
        {error.visible && (
          <div className="alert alert-danger" role="alert">
            {error.text}
          </div>
        )}
        <CustomInput
          label="Username"
          type="text"
          name="username"
          onChange={this.handleChange}
          isInvalid={username != null && !username}
          errorText="Please input a username"
        />
        <CustomInput
          label="Password"
          type="password"
          name="password"
          onChange={this.handleChange}
          isInvalid={password != null && !password}
          errorText="Please input a password"
        />
        <input
          type="submit"
          className="btn btn-info btn-raised float-right"
          value={logging ? 'Logging in...' : 'Login'}
          disabled={logging || !username || !password}
        />
        <Link
          className="text-small float-right"
          to="/register"
          style={{ lineHeight: '35px', paddingRight: '10px', fontSize: '14px' }}
        >
          Register
        </Link>
      </form>
    )
  }

  render() {
    return (
      <main
        className="d-flex align-items-center flex-column justify-content-center h-100 bg-gradient text-black"
        style={{ height: '100%' }}
      >
        <Switch>
          <Route exact path="/login" component={this.loginPage} />
          <Route path="/register" component={Register} />
          <Redirect to="/login" />
        </Switch>
      </main>
    )
  }
}

export default withRouter(Login)
