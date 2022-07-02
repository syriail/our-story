import React from 'react'
import Auth from './auth/Auth'
import { Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import createHistory from 'history/createBrowserHistory'
import App from './App';
const history = createHistory()

const auth = new Auth(history)


export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
      <Route
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
        
      </div>
    </Router>
  )
}
