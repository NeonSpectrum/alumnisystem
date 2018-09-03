import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import CustomInput from '../Components/CustomInput.component'

import { register } from '../Controllers/User.controller'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registering: false,
      username: null,
      password: null,
      vpassword: null,
      firstname: null,
      lastname: null,
      error: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(props) {
    if (this.props.registering !== props.registering) {
      if (props.error) {
        this.setState({
          error: props.error
        })
      } else if (props.success) {
        alert('Registered Successfully!')
        props.history.push('/login')
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    let { username, password, firstname, lastname } = this.state

    this.props.register({
      username,
      password,
      firstname,
      lastname
    })
  }

  handleChange(e) {
    let { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  render() {
    const { error, username, password, vpassword, firstname, lastname } = this.state
    const { registering } = this.props
    return (
      <form className="form card-form p-5" onSubmit={this.handleSubmit}>
        <h3 className="text-center text-info">Registration Form</h3>
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
          label="First Name"
          type="text"
          name="firstname"
          onChange={this.handleChange}
          isInvalid={firstname !== null && !firstname}
          errorText="Please input a first name"
        />
        <CustomInput
          label="Last Name"
          type="text"
          name="lastname"
          onChange={this.handleChange}
          isInvalid={lastname !== null && !lastname}
          errorText="Please input a last name"
        />
        <CustomInput
          label="Password"
          type="password"
          name="password"
          onChange={this.handleChange}
          isInvalid={password !== null && !password}
          errorText="Please input a password"
        />
        <CustomInput
          label="Verify Password"
          type="password"
          name="vpassword"
          onChange={this.handleChange}
          isInvalid={vpassword !== null && !vpassword}
          errorText="Please input a verify password"
          extra={
            vpassword !== null && password !== vpassword ? (
              <span className="error text-danger">Password is not match.</span>
            ) : (
              ''
            )
          }
        />
        <input
          type="submit"
          className="btn btn-info btn-raised float-right"
          value={registering ? 'Registering...' : 'Register'}
          disabled={
            registering || !username || !password || !vpassword || !firstname || !lastname || password !== vpassword
          }
        />
        <Link
          className="float-right"
          to="/login"
          style={{ lineHeight: '35px', paddingRight: '10px', fontSize: '14px' }}
        >
          Go back
        </Link>
      </form>
    )
  }
}
const mapStateToProps = ({ UserReducer }) => {
  let { register } = UserReducer
  return register || {}
}

const mapDispatchToProps = {
  register
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)
