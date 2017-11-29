import * as React from 'react'
import { observer, inject, Provider } from 'mobx-react'
import { withRouter } from 'react-router'

import LocalStore from './store'
import Store from 'store'

import LeftBar from './left-bar'
import Title from './title'
import Graph from './graph'
import Timeline from './timeline'
import HeroInfo from './hero-info'

const styles = require('./style.scss')

interface Props {
  store?: Store
  match?: any
}

@withRouter
@inject('store')
@observer
class Page extends React.Component<Props, null>{
  render() {
    const { store } = this.props
    const pageStore = new LocalStore(store.dataStore, this.props.match.params.id)

    window.pageStore = pageStore

    return (
      <Provider pageStore={pageStore}>
        <div className={styles.page}>
          <LeftBar/>
          <div className={styles.centralContent}>
            <Title/>
            <Graph/>
          </div>
          <Timeline/>
          <HeroInfo/>
        </div>
      </Provider>
    )
  }
}

export default Page