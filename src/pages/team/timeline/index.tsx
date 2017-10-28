import * as React from 'react'
import { observer, inject } from 'mobx-react'

import Item from './item'

const styles = require('./style.scss')

interface Props{
  matches?: FullMatch[]
}

@inject(({ pageStore }) => ({ matches: pageStore.filteredMatches }))
@observer
export default class Timeline extends React.Component<Props, null>{
  render() {
    return (
      <div className={styles.rightBar}>
      {
        this.props.matches.map((match) => (
          <Item match={match} key={match.id}/>
        ))
      }
      </div>
    )
  }
}