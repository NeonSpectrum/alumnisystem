export const ADD_TEMPLATE = 'ADD_TEMPLATE'
export const ADD_TEMPLATE_SUCCESS = 'ADD_TEMPLATE_SUCCESS'
export const ADD_TEMPLATE_FAIL = 'ADD_TEMPLATE_FAIL'
export const DELETE_TEMPLATE = 'DELETE_TEMPLATE'
export const DELETE_TEMPLATE_SUCCESS = 'DELETE_TEMPLATE_SUCCESS'
export const DELETE_TEMPLATE_FAIL = 'DELETE_TEMPLATE_FAIL'
export const SAVE_TEMPLATE = 'SAVE_TEMPLATE'
export const SAVE_TEMPLATE_SUCCESS = 'SAVE_TEMPLATE_SUCCESS'
export const SAVE_TEMPLATE_FAIL = 'SAVE_TEMPLATE_FAIL'

export default function TemplateReducer(state = {}, action) {
  let { type } = action

  if (type.startsWith(ADD_TEMPLATE)) {
    return processAddTemplate(state, action)
  } else if (type.startsWith(SAVE_TEMPLATE)) {
    return processSaveTemplate(state, action)
  } else {
    return state
  }
}

function processAddTemplate(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case ADD_TEMPLATE:
      obj = { adding: true }
      break
    case ADD_TEMPLATE_SUCCESS:
      if (payload.data.success) {
        obj = { adding: false, success: true }
      } else {
        obj = { adding: false, success: false, error: 'There was an error uploading the picture.' }
      }
      break
    case ADD_TEMPLATE_FAIL:
      obj = { adding: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, modal: obj }
}

function processSaveTemplate(state, action) {
  let { type, payload } = action
  let obj = {}

  switch (type) {
    case SAVE_TEMPLATE:
      obj = { saving: true }
      break
    case SAVE_TEMPLATE_SUCCESS:
      if (payload.data.success) {
        obj = { saving: false, success: true }
      } else {
        obj = { saving: false, success: false, error: 'There was an error.' }
      }
      break
    case SAVE_TEMPLATE_FAIL:
      obj = { saving: false, error: 'Cannot connect to server.' }
      break
    default:
      obj = state
  }

  return { ...state, template: obj }
}
