import * as React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
// import { AppContainer } from 'react-hot-loader'
import { Provider } from 'mobx-react'

import Bundle from './bundle'
// import Team from './team'

const history = createBrowserHistory()
const loadTeam = cb => require.ensure([], require => cb(require('./team')), 'TeamPage')

const Team = () => <Bundle load={loadTeam}/>

export default ({ store }) => (
  <Provider store={store}>
    {/* <AppContainer> */}
      <Router history={history}>
        <Switch>
          <Redirect exact from='/' to='/teams/36'/>
          <Route path='/teams/:id' component={Team}/>
        </Switch>
      </Router>
    {/* </AppContainer> */}
  </Provider>
)
