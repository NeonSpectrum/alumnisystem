import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './App'

import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'

import { API_URL, SOCKET_URL } from './Global'

import openSocket from 'socket.io-client'

import UserReducer from './Reducers/User.reducer'
import DataReducer from './Reducers/Data.reducer'
import TemplateReducer from './Reducers/Template.reducer'

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

const socket = openSocket(SOCKET_URL)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()

export { socket }
