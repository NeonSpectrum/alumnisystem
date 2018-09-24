import React, { Component } from 'react'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import Register from './Register.page'
import CustomInput from '../Components/CustomInput.component'

import { login } from '../Controllers/User.controller'
import { PUBLIC_URL } from '../Global'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logging: false,
      username: null,
      password: null,
      error: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loginPage = this.loginPage.bind(this)
    this.props.history.listen((location, action) => {
      window.init()
      this.setState({ error: null })
    })
  }

  componentDidMount() {
    window.init()
  }

  componentWillReceiveProps(props) {
    if (this.props.logging !== props.logging) {
      if (props.error) {
        this.setState({
          error: props.error
        })
      } else if (props.success) {
        sessionStorage.auth = JSON.stringify({ user: this.state.username, token: props.token })
        window.location.href = PUBLIC_URL + '/'
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    let { username, password } = this.state

    this.props.login(username, password)
  }

  handleChange(e) {
    let { name, value } = e.target
    this.setState({
      [name]: value,
      error: null
    })
  }

  loginPage() {
    const { username, password, error } = this.state
    const { logging } = this.props
    return (
      <form className="form card-form p-5" onSubmit={this.handleSubmit}>
        <h3 className="text-center">Login Form</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <CustomInput
          label="Username"
          type="text"
          name="username"
          onChange={this.handleChange}
          isInvalid={username !== null && !username}
          errorText="Please input a username"
        />
        <CustomInput
          label="Password"
          type="password"
          name="password"
          onChange={this.handleChange}
          isInvalid={password !== null && !password}
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
      <main className="d-flex align-items-center flex-column justify-content-center h-100 bg-gradient text-black background">
        <Switch>
          <Route exact path="/login" component={this.loginPage} />
          <Route path="/register" component={Register} />
          <Redirect path="*" to="/login" />
        </Switch>
      </main>
    )
  }
}

const mapStateToProps = ({ UserReducer }) => {
  let { login } = UserReducer
  return login || {}
}

const mapDispatchToProps = {
  login
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
)
