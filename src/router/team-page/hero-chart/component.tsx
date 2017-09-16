import * as React from 'react'

import chart from './chart'
const styles = require('./style.scss')

// const margin = { top: 0, left: 0, bottom: 0, right: 0 }
// const chartWidth = width - (margin.left + margin.right)
// const chartHeight = height - (margin.top + margin.bottom)

interface props{
  nodes: any
  links: any
  width: any
  height: any
}

export default class extends React.Component<props, any>{
  simulation

  componentDidMount() {
    this.simulation = chart.createSimulation()
  }

  shouldComponentUpdate(props) {
    chart.resetSVG()
    this.simulation = chart.createSimulation()
    chart.render(this.simulation, props.nodes, props.links)
    return false
  }

  render() {
    return (
      <svg id='graph' className={styles.container}>
        <g className='chartLayer' transform='translate(0,0)'/>
      </svg>
    )
  }
}