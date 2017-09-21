import * as React from 'react'

import createChart from 'utils/createChart'
const styles = require('./style.scss')

interface props{
  nodes: any
  links: any
  width: any
  height: any
}

export default class extends React.Component<props, any>{
  simulation

  componentDidMount() {
    createChart(this.props.nodes, this.props.links)
  }

  shouldComponentUpdate(props) {
    createChart(props.nodes, props.links)
    return false
  }

  render() {
    return (
      <svg className={styles.container}>
        <g id='allLink'/>
        <g id='allNode'/>
        <defs id='allPattern'/>
      </svg>
    )
  }
}