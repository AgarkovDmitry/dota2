import * as React from 'react'

// import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'
import * as d3 from 'd3'


interface props{
  info: any
  store: any
}

export default class extends React.Component<props, null>{
  componentDidUpdate() {
    console.log(this.props)

    let width, height
    let chartWidth, chartHeight
    let margin
    d3.selectAll('svg').remove()
    let svg = d3.select('#graph').append('svg')
    let chartLayer = svg.append('g').classed('chartLayer', true)

    const nodes = this.props.info.singleHeroStats.map(item => ({
      label: `${this.props.store.getHero(item.heroes[0]).localized_name}-${item.winRate * 100}%-${item.picks}`,
      r: 16 + 2 * item.picks,
      color: item.winRate > 0.5 ? 'green' : 'red',
      id: item.heroes[0],
      src: `https://api.opendota.com${this.props.store.getHero(item.heroes[0]).icon}`
    }))

    const links = this.props.info.pairHeroStats.map(item => ({
      source: nodes.findIndex(node => node.id == item.heroes[0]),
      target: nodes.findIndex(node => node.id == item.heroes[1]),
      color: item.winRate > 0.5 ? 'green' : 'red',
      width: (2 * item.picks).toFixed(0),
      label: `${item.winRate}%`
    }))

    let data = {
      nodes,
      links
    }

    setSize(data)
    drawChart(data)

    function setSize(data) {
        width = 800
        height = 600

        margin = { top: 0, left: 0, bottom: 0, right: 0 }

        chartWidth = width - (margin.left + margin.right)
        chartHeight = height - (margin.top + margin.bottom)

        svg.attr('width', width).attr('height', height)

        chartLayer
          .attr('width', chartWidth)
          .attr('height', chartHeight)
          .attr('transform', 'translate(' + [margin.left, margin.top] + ')')
    }

    function drawChart(data) {
        const simulation = d3.forceSimulation()
          .force('link', d3.forceLink().id(d => d.index))
          .force('collide',d3.forceCollide(d => d.r + 8).iterations(16))
          .force('charge', d3.forceManyBody())
          .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
          .force('y', d3.forceY(0))
          .force('x', d3.forceX(0))

        const link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(data.links)
          .enter()
          .append('line')
          .attr('stroke', d => d.color)
          .attr('stroke-width', d => d.width)
          .attr('stroke-opacity', 0.4)

        const node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(data.nodes)
          .enter().append('circle')
          .attr('r', d => d.r)
          .attr('fill', d => 'url(#img' + d.id + ')')
          .attr('stroke', d => d.color)
          .attr('stroke-width', d => 4)
          .attr('stroke-opacity', 0.4)
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
          )

				const pattern = svg.append('defs')
					.selectAll('pattern')
					.data(data.nodes)
					.enter().append('pattern')
					.attr('id', d => 'img' + d.id)
					.attr('patternUnits', 'objectBoundingBox')
					.attr('width', 1)
					.attr('height', 1)

				pattern.append('image')
					.attr('xlink:href', d => d.src)
					.attr('x', d => d.r - 16)
					.attr('y', d => d.r - 16)

				node.append('title')
      			.text(d => d.label)

				link.append('title')
      			.text(d => d.label)

        const ticked = function() {
					link
						.attr('x1', d => d.source.x)
						.attr('y1', d => d.source.y)
						.attr('x2', d => d.target.x)
						.attr('y2', d => d.target.y)

					node
						.attr('cx', d => d.x)
						.attr('cy', d => d.y)
        }

        simulation
            .nodes(data.nodes)
            .on('tick', ticked)

        simulation.force('link').links(data.links)

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
        }

        function dragged(d) {
            d.fx = d3.event.x
            d.fy = d3.event.y
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
        }
    }
  }
  render() {
    return (
      <div id='graph'/>
    )
  }
}