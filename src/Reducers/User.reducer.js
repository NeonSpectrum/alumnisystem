export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const LOGOUT = 'LOGOUT'
export const REGISTER = 'REGISTER'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAIL = 'REGISTER_FAIL'
export const GET_INFO = 'GET_INFO'
export const GET_INFO_SUCCESS = 'GET_INFO_SUCCESS'
export const GET_INFO_FAIL = 'GET_INFO_FAIL'

export default function UserReducer(state = {}, action) {
  let { type } = action

  if (type.startsWith(LOGIN)) {
    return processLogin(state, action)
  } else if (type.startsWith(REGISTER)) {
    return processRegister(state, action)
  } else if (type.startsWith(GET_INFO)) {
    return processGetInfo(state, action)
  } else {
    return state
  }
}

function processLogin(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case LOGIN:
      obj = { logging: true }
      break
    case LOGIN_SUCCESS:
      if (payload.data.success) {
        obj = { logging: false, success: true, token: payload.data.token }
      } else {
        obj = { logging: false, error: 'Invalid Username and/or Password.' }
      }
      break
    case LOGIN_FAIL:
      obj = { logging: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, login: obj }
}

function processRegister(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case REGISTER:
      obj = { registering: true }
      break
    case REGISTER_SUCCESS:
      if (payload.data.success) {
        obj = { registering: false, success: true }
      } else {
        obj = { registering: false, error: 'Already Registered.' }
      }
      break
    case REGISTER_FAIL:
      obj = { registering: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, register: obj }
}

function processGetInfo(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case GET_INFO:
      obj = { loading: true }
      break
    case GET_INFO_SUCCESS:
      obj = { loading: false, data: payload.data.info }
      break
    case GET_INFO_FAIL:
      obj = { loading: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, info: obj }
}
