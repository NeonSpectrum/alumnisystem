import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import CustomInput from '../Components/CustomInput'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registering: false,
      username: null,
      password: null,
      vpassword: null,
      firstname: null,
      lastname: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(e) {
    e.preventDefault()

    if (!this.isPasswordMatched()) {
      return alert('Password not matched!')
    }

    let { username, password, firstname, lastname } = this.state

    this.setState({ registering: true })

    try {
      let res = await fetch('/api/register', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname
        })
      })
      let data = await res.json()

      if (data.success) {
        alert('Registered Successfully!')
      } else {
        alert('Registered Failed')
      }
    } catch (err) {
      alert(err)
      alert('There was an error')
    } finally {
      this.setState({
        registering: false
      })
    }
  }

  handleChange(e) {
    let { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  isPasswordMatched() {
    let { password, vpassword } = this.state
    return password === vpassword
  }

  render() {
    const { registering, username, password, vpassword, firstname, lastname } = this.state
    return (
      <form className="form card-form p-5" onSubmit={this.handleSubmit}>
        <h3 className="text-center text-info">Registration Form</h3>
        <CustomInput
          label="Username"
          type="text"
          name="username"
          onChange={this.handleChange}
          isInvalid={username != null && !username}
          errorText="Please input a username"
        />
        <CustomInput
          label="First Name"
          type="text"
          name="firstname"
          onChange={this.handleChange}
          isInvalid={firstname != null && !firstname}
          errorText="Please input a first name"
        />
        <CustomInput
          label="Username"
          type="text"
          name="lastname"
          onChange={this.handleChange}
          isInvalid={lastname != null && !lastname}
          errorText="Please input a last name"
        />
        <CustomInput
          label="Password"
          type="password"
          name="password"
          onChange={this.handleChange}
          isInvalid={password != null && !password}
          errorText="Please input a password"
        />
        <CustomInput
          label="Verify Password"
          type="password"
          name="vpassword"
          onChange={this.handleChange}
          isInvalid={vpassword != null && !vpassword}
          errorText="Please input a verify password"
          extra={
            vpassword != null && password !== vpassword ? (
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
          disabled={registering || !username || !password || !vpassword || !firstname || !lastname}
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

export default Register
