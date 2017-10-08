import * as React from 'react'

import Drawer from 'components/drawer'
import Loader from 'components/loader'
import Select from 'components/select'
import ChooseTeamBody from 'components/drawer/bodies/choose-team'

import Store from 'store'

const styles = require('./style.scss')

interface Props{
  store: Store
  history: any
  team: number
}

export default class LeftBar extends React.Component<Props, null>{
  render() {
    const loading = this.props.store.dataStore.loadingMatches
    const fetchMatches = () => this.props.store.dataStore.loadMatchesWithExtras(5, false, { team: this.props.store.localStore.team })
    const matchesLength = this.props.store.localStore.filteredMatches.length
    const select = this.props.store.localStore.select
    const availableLeagues = this.props.store.localStore.availableLeagues
    const availableRivals = this.props.store.localStore.availableRivals
    const leagues = this.props.store.localStore.leagues
    const rivals = this.props.store.localStore.rivals

    return (
      this.props.team
      ? <div className={styles.leftBar}>
        <div className={styles.fetchContainer}>
          <button onClick={fetchMatches} className={styles.teamsButton} disabled={loading}>
            {
              !loading
              ? `Load more matches(${matchesLength})`
              : <Loader/>
            }
          </button>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterWrap}>
            <Select
              filter={true}
              handleSelect={item => select(item)}
              name={'Leagues'}
              options={availableLeagues}
              selected={leagues}
              mapObject={item => item.name}
            />
          </div>
          <div className={styles.filterWrap}>
            <Select
              filter={true}
              handleSelect={item => select(item)}
              name={'Rivals'}
              options={availableRivals}
              selected={rivals}
              mapObject={item => item.name}
            />
          </div>
        </div>

        <div className={styles.teamContainer}>
          <Drawer
            trigger={
              ({ open }) => <button onClick={open} className={styles.teamsButton}>
                Select another team
              </button>
            }
            body={ChooseTeamBody}
          />
        </div>
      </div>
      : null
    )
  }
}