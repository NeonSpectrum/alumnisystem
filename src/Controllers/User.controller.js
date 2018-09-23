import { LOGIN, REGISTER, GET_INFO, LOGOUT } from '../Reducers/User.reducer'

export function login(username, password) {
  return {
    type: LOGIN,
    payload: {
      request: {
        url: '/admin/login',
        method: 'POST',
        data: { username, password }
      }
    }
  }
}

export function register(data) {
  return {
    type: REGISTER,
    payload: {
      request: {
        url: '/admin/register',
        method: 'PUT',
        data
      }
    }
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}

export function getInfo() {
  let { user, token } = JSON.parse(sessionStorage.auth)
  return {
    type: GET_INFO,
    payload: {
      request: {
        url: `/admin/${user}/data`,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    }
  }
}
