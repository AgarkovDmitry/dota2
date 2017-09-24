import * as React from 'react'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
// import Loadable from 'react-loadable'

// const styles = require('./style.less')

import Team from 'router/team-page'
import Teams from 'router/teams-page'
// const Home = Loadable({
//   loader: () => import('components/pages/home-page'),
//   loading
// })

export default ({ store }) => (
  <Provider {...store} store={store}>
    <Router history={createBrowserHistory()}>
      <div>
        <Switch>
          <Route path='/teams/:id' component={Team}/>
          <Route path='/teams' component={Teams}/>
        </Switch>
        <DevTools />
      </div>
    </Router>
  </Provider>
)
