import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ team, store, id }) => ({
      hero: store.getHero(id),
      bans: store.heroBansAgainstTeam({ hero_id: id, team_id: team }),
      heroStat: store.heroStat({ hero_id: id, team_id: team }),
      picks: store.heroStat({ hero_id: id, team_id: team }).reduce((res, a) => res + a.picks, 0),
      wins: store.heroStat({ hero_id: id, team_id: team }).reduce((res, a) => res + a.wins, 0)
    })
  ),
  observer
)(Component)