import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,=
  mapProps(
    ({ store }) => {
      const id = store.localStore.selectedHero
      const team = store.localStore.team_id
      const heroStat = store.heroStat({ hero_id: id, team_id: team })
      return ({
        hero: store.getHero(id),
        bans: store.heroBansAgainstTeam({ hero_id: id, team_id: team }),
        heroStat: heroStat,
        picks: heroStat.reduce((res, a) => res + a.picks, 0),
        wins: heroStat.reduce((res, a) => res + a.wins, 0),
        id: id
      })
    }
  ),
  observer
)(Component)