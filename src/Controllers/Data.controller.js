import { FETCH_STUDENT_DATA, FETCH_TEMPLATE } from '../Reducers/Data.reducer'

export function fetchStudentData() {
  let { token } = JSON.parse(sessionStorage.auth)
  return {
    type: FETCH_STUDENT_DATA,
    payload: {
      request: {
        url: '/users/data',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    }
  }
}

export function fetchTemplates(id = '') {
  return {
    type: FETCH_TEMPLATE,
    payload: {
      request: {
        url: '/templates/' + id,
        method: 'GET'
      }
    }
  }
}
