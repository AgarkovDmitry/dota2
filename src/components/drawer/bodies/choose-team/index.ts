import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ store, history, close }) => ({
      teams: store.dataStore.teams
        .sort((a, b) => b.rating - a.rating)
        .filter((item, key) => key < 100),
      chooseTeam: (team) => {
        close()
        history.push(`/teams/${team.id}`)
        store.localStore.setTeam(team.id)
      },
      close
    })
  ),
  observer
)(Component)