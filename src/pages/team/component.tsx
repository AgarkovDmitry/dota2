import * as React from 'react'

import HeroInfo from './hero-info'
import LeftBar from './left-bar'

import LocalStore from './store'
import MatchContainer from './match-container'
const styles = require('./style.scss')

interface Props {
  store: any
  match: any
}

class Page extends React.Component<Props, null>{
  componentDidMount() {
    this.props.store.setLocalStore(LocalStore, this.props.match.params.id)
  }

  render() {
    const { store } = this.props
    const team = store.localStore && store.localStore.team

    return (
      team && store.localStore
      ? <div className={styles.page}>
        <LeftBar team={team}/>
        <div className={styles.centralContent}>
          <h1 className={styles.centralTitle}>{team.name}({team.winRate}%)</h1>
          <svg className={styles.svgContainer}>
            <g id='allLink'/>
            <g id='allNode'/>
            <defs id='allPattern'/>
          </svg>
        </div>
        <div className={styles.rightBar}>
          {
            this.props.store.localStore.filteredMatches.map((match) => (
              <MatchContainer match={match} key={match.id}/>
            ))
          }
        </div>
        <HeroInfo/>
      </div>
      : null
    )
  }
}

export default Page