import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './App'

import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'

import { API_URL } from './Global'

import UserReducer from './Reducers/User.reducer'
import DataReducer from './Reducers/Data.reducer'
import TemplateReducer from './Reducers/Template.reducer'

library.add(faPlus, faEdit, faSave)

const client = axios.create({
  baseURL: API_URL,
  responseType: 'json'
})

const appReducer = combineReducers({
  UserReducer,
  DataReducer,
  TemplateReducer
})

const rootReducer = (state, action) => {
  console.log(action.type)

  if (action.type === 'LOGOUT') {
    sessionStorage.removeItem('auth')
    state = {}
  }

  return appReducer(state, action)
}

const store = createStore(rootReducer, applyMiddleware(axiosMiddleware(client), thunk))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
