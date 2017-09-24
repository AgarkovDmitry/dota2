import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ store }) => {
      const id = store.localStore.selectedHero
      const heroStat = store.localStore.heroStat
      return ({
        hero: store.localStore.data.heroes.getHero(id),
        heroStat: heroStat,
        picks: heroStat.reduce((res, a) => res + a.picks, 0),
        bans: store.localStore.heroBansAgainstTeam,
        wins: heroStat.reduce((res, a) => res + a.wins, 0),
        id: id
      })
    }
  ),
  observer
)(Component)