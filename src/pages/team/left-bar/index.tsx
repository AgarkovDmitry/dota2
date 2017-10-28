import * as React from 'react'
import { observer, inject } from 'mobx-react'

import Drawer from 'components/drawer'
import Loader from 'components/loader'
import Select from 'components/select'
import Button from 'components/button'
import ChooseTeamBody from 'components/drawer/bodies/choose-team'

import Store from 'store'
import PageStore from '../store'

const styles = require('./style.scss')

interface Props{
  store?: Store
  pageStore?: PageStore
}

@inject('pageStore', 'store')
@observer
export default class LeftBar extends React.Component<Props, null>{
  render() {
    if (!this.props.pageStore) return null

    const loading = this.props.pageStore.loading
    const fetchMatches = this.props.pageStore.fetchMore
    const matchesLength = this.props.pageStore.filteredMatches.length
    const select = this.props.pageStore.select
    const selectSide = this.props.pageStore.selectSide

    const availableLeagues = this.props.pageStore.availableLeagues
    const availableSides = this.props.pageStore.availableSides
    const availableRivals = this.props.pageStore.availableRivals

    const leagues = this.props.pageStore.leagues
    const side = this.props.pageStore.side
    const rivals = this.props.pageStore.rivals

    return (
      <div className={styles.leftBar}>
        <div className={styles.fetchContainer}>
          <Button handleClick={fetchMatches} disabled={loading || !navigator.onLine}>
          {
            navigator.onLine
            ? !loading
              ? `Load more matches(${matchesLength})`
              : <Loader/>
            : 'Offline mode'
          }
          </Button>
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
              handleSelect={item => selectSide(item)}
              name={'Side'}
              options={availableSides}
              selected={[side]}
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
              ({ open }) => <Button handleClick={open}>
                  Select another team
              </Button>
            }
            body={ChooseTeamBody}
          />
        </div>
      </div>
    )
  }
}