import * as React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import Team from './team'

export default ({ store }) => (
  <Provider {...store} store={store}>
    <Router history={createBrowserHistory()}>
      <div>
        <Switch>
          <Route exact path='/' render={() => (
            <Redirect to='/teams/36'/>
          )}/>
          <Route path='/teams/:id' component={Team}/>
        </Switch>
        <DevTools />
      </div>
    </Router>
  </Provider>
)
