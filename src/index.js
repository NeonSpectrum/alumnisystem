import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './App'

import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import userReducer from './Reducers/User.reducer'

const reducers = combineReducers({
  user: userReducer
})
const store = createStore(reducers)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
