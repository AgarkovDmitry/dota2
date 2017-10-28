import * as React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'

import Team from './team'

export default ({ store }) => (
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Switch>
        <Redirect exact from='/' to='/teams/36'/>
        <Route path='/teams/:id' component={Team}/>
      </Switch>
    </Router>
  </Provider>
)
