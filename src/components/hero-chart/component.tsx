import * as React from 'react'

import createChart from './chart'

interface props{
  info: any
  store: any
  nodes: any
  links: any
  forceStrength: any
  linkDistance: any
  width: any
  height: any
}

export default class extends React.Component<props, null>{
  componentDidUpdate() {
    const nodes = this.props.info.singleHeroStats.map(item => ({
      label: `${this.props.store.getHero(item.heroes[0]).localized_name}-${item.winRate * 100}%-${item.picks} picks`,
      r: 18 + 1.5 * item.picks,
      color: item.winRate > 0.5 ? 'green' : 'red',
      id: item.heroes[0],
      src: `https://api.opendota.com${this.props.store.getHero(item.heroes[0]).icon}`
    }))

    const links = this.props.info.pairHeroStats.filter(item => item.picks > 1).map(item => ({
      source: nodes.findIndex(node => node.id == item.heroes[0]),
      target: nodes.findIndex(node => node.id == item.heroes[1]),
      color: item.winRate > 0.5 ? 'green' : 'red',
      width: 1 + (0.8 * item.picks),
      label: `${item.winRate * 100}% - ${item.picks} picks`
    }))

    createChart(nodes, links)
  }

  render() {
    return (
      <div id='graph'>
      </div>
    )
  }
}