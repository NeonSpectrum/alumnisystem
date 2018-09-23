import { ADD_TEMPLATE, SAVE_TEMPLATE, DELETE_TEMPLATE } from '../Reducers/Template.reducer'

export function addTemplate(name, file) {
  let formData = new FormData()

  formData.append('name', name)
  formData.append('file', file)

  return {
    type: ADD_TEMPLATE,
    payload: {
      request: {
        url: '/templates/add',
        method: 'PUT',
        data: formData
      }
    }
  }
}

export function deleteTemplate(id) {
  return {
    type: DELETE_TEMPLATE,
    payload: {
      request: {
        url: '/templates/' + id + '/delete',
        method: 'DELETE'
      }
    }
  }
}

export function saveTemplate(id, data) {
  return {
    type: SAVE_TEMPLATE,
    payload: {
      request: {
        url: '/templates/' + id + '/edit',
        method: 'PUT',
        data
      }
    }
  }
}
