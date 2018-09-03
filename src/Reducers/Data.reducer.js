export const FETCH_STUDENT_DATA = 'FETCH_STUDENT_DATA'
export const FETCH_STUDENT_DATA_SUCCESS = 'FETCH_STUDENT_DATA_SUCCESS'
export const FETCH_STUDENT_DATA_FAIL = 'FETCH_STUDENT_DATA_FAIL'
export const FETCH_TEMPLATE = 'FETCH_TEMPLATE'
export const FETCH_TEMPLATE_SUCCESS = 'FETCH_TEMPLATE_SUCCESS'
export const FETCH_TEMPLATE_FAIL = 'FETCH_TEMPLATE_FAIL'

export default function DataReducer(state = {}, action) {
  let { type } = action

  if (type.startsWith(FETCH_STUDENT_DATA)) {
    return processStudentData(state, action)
  } else if (type.startsWith(FETCH_TEMPLATE)) {
    return processTemplate(state, action)
  } else {
    return state
  }
}

function processStudentData(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case FETCH_STUDENT_DATA:
      obj = { loading: true }
      break
    case FETCH_STUDENT_DATA_SUCCESS:
      obj = { loading: false, data: payload.data }
      break
    case FETCH_STUDENT_DATA_FAIL:
      obj = { loading: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, student: obj }
}

function processTemplate(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case FETCH_TEMPLATE:
      obj = { loading: true }
      break
    case FETCH_TEMPLATE_SUCCESS:
      obj = { loading: false, data: payload.data }
      break
    case FETCH_TEMPLATE_FAIL:
      obj = { loading: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, template: obj }
}
