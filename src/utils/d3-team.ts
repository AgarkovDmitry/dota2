import * as d3 from 'd3'
import { createTransformer } from 'mobx'

const getWinRateColor = (winRate: number) => {
  if (winRate <= 0.1) return '#FF0000'
  if (winRate <= 0.2) return '#FB3700'
  if (winRate <= 0.3) return '#F76D00'
  if (winRate <= 0.4) return '#F3A200'
  if (winRate <= 0.5) return '#EFD500'
  if (winRate <= 0.6) return '#D1EC00'
  if (winRate <= 0.7) return '#9AE800'
  if (winRate <= 0.8) return '#65E400'
  if (winRate <= 0.9) return '#31E000'
  if (winRate <= 1.0) return '#00DD00'
}

export default class D3Team {
  simulation

  nodeWrap
  defsWrap
  linkWrap

  drag

  ghostId: number

  constructor () {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.index))
      .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(window.innerWidth * 0.6 / 2, window.innerHeight * 0.8  / 2))
      .force('y', d3.forceY(0))
      .force('x', d3.forceX(0))

    const dragstarted = d => {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    const dragged = d => {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    const dragended = d => {
      if (!d3.event.active) this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    this.ghostId = -1

    this.drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  generateNodes (nodes) {
    const nodeG = d3.select('#allNode')
    this.nodeWrap = nodeG.selectAll('circle').data(nodes, d => d.id)

    this.nodeWrap.exit().remove()
    const nodeWrapEnter = this.nodeWrap.enter()

    nodeWrapEnter
      .append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => 'url(#img' + d.id + ')')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('stroke-opacity', d => d.opacity)
      .attr('stroke-dasharray', d => d.array)
      .attr('stroke-dashoffset', d => d.offset)
      .attr('class', d => d.class)
      .on('click', d => d.onClick())
      .call(this.drag)
      .append('title')
      .text(d => d.label)

    this.nodeWrap
      .attr('r', d => d.r)
      .attr('fill', d => 'url(#img' + d.id + ')')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('stroke-opacity', d => d.opacity)
      .attr('stroke-dasharray', d => d.array)
      .attr('stroke-dashoffset', d => d.offset)
      .attr('class', d => d.class)
      // .attr('cx', d => d.x)
      // .attr('cy', d => d.y)
      .on('click', d => d.onClick())
      .call(this.drag)
      .select('title')
      .text(d => d.label)

      this.nodeWrap = nodeWrapEnter.merge(this.nodeWrap)
  }

  generateDefs (nodes) {
    const defsG = d3.select('#allPattern')
    this.defsWrap = defsG.selectAll('pattern').data(nodes, d => d.id)

    this.defsWrap
      .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
      .select('image')
      .attr('xlink:href', d => d.src)
      .attr('x', d => d.r - 16)
      .attr('y', d => d.r - 16)

    this.defsWrap.exit().remove()
    let defsWrapEnter = this.defsWrap.enter()

    defsWrapEnter
      .append('pattern')
      .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
      .append('image')
      .attr('xlink:href', d => d.src)
      .attr('x', d => d.r - 16)
      .attr('y', d => d.r - 16)

    this.defsWrap = defsWrapEnter.merge(this.defsWrap)
  }

  generateLinks (links) {
    const linkG = d3.select('#allLink')
    this.linkWrap = linkG.selectAll('line').data(links, d => d.id)

    this.linkWrap.exit().remove()
    let linkWrapEnter = this.linkWrap.enter()

    linkWrapEnter
      .append('line')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.width)
      .attr('stroke-opacity', d => d.opacity)

    this.linkWrap
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.width)
      .attr('stroke-opacity', d => d.opacity)

    this.linkWrap = linkWrapEnter.merge(this.linkWrap)
  }

  tick = () => {
    this.linkWrap
    .selectAll('line')
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)

    this.nodeWrap
      .selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }

  convertInfo = createTransformer(({ info, selectedHeroes, selectHero, getHero, styles }) => {
    const nodes = info.nodes.map(item => ({
      label: `${getHero(item.id).name}`,
      r: item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2),
      color: getWinRateColor(item.win / item.pick),
      id: item.id,
      src: getHero(item.id).icon,
      array: selectedHeroes.includes(item.id) ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI / 8 : 0,
      offset: selectedHeroes.includes(item.id) ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI : 0,
      class: selectedHeroes.includes(item.id) ? styles.selectedHero : styles.hero,
      opacity: 1,
      onClick: () => selectHero(item.id)
    }))

    nodes.push({
      label: 'ghost',
      r: 0,
      color: 0,
      id: this.ghostId + '-ghost-node',
      src: '',
      width: 0,
      array: 0,
      offset: 0,
      class: 'ghost',
      opacity: 0,
      onClick: () => {}
    })

    const links = info.links
      .filter(item => item.pick > 1)
      .filter(item => !selectedHeroes.includes(item.source) && !selectedHeroes.includes(item.target))
      .map(item => ({
        id: item.id,
        source: nodes.findIndex(node => node.id == item.source),
        target: nodes.findIndex(node => node.id == item.target),
        color: getWinRateColor(item.win / item.pick),
        width: 3,
        opacity: item.pick * 0.2
      }))

    links.push({
      id: this.ghostId + '-ghost-line',
      source: nodes.length - 1,
      target: nodes.length - 1,
      color: 'transparent',
      width: 0,
      opacity: 0
    })

    return { nodes, links }
  })

  render (props) {
    const { nodes, links } = this.convertInfo(props)

    this.ghostId = this.ghostId - 1

    this.generateLinks(links)
    this.generateDefs(nodes)
    this.generateNodes(nodes)


    this.simulation
      .nodes(nodes)
      .on('tick', this.tick)

    this.simulation.force('link').links(links)
    this.simulation.alpha(1).restart()
  }
}