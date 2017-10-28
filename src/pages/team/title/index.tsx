import * as React from 'react'
import { observer, inject } from 'mobx-react'

const styles = require('./style.scss')

interface Props{
  team?: Team
}

@inject(({ pageStore }) => ({ team: pageStore.team }))
@observer
export default class HeroInfo extends React.Component<Props, null>{
  render () {
    return (
      <h1 className={styles.centralTitle}>
        {
          this.props.team && `${this.props.team.name}(${this.props.team.winRate}%)`
        }
      </h1>
    )
  }
}