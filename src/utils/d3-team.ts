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

  nodes
  links

  drag

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

    this.nodes = []
    this.links = []

    this.drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  generateNodes (nodes) {
    this.nodeWrap = d3.select('#allNode').selectAll('g').data(this.nodes, d => d.id)

    this.nodeWrap
      .select('circle')
      .attr('r', d => d.r)
      .attr('fill', d => 'url(#img' + d.id + ')')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3)
      .attr('stroke-opacity', d => d.opacity)
      .attr('stroke-dasharray', d => d.array)
      .attr('stroke-dashoffset', d => d.offset)
      .attr('class', d => d.class)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .on('click', d => d.onClick())
      .call(this.drag)
      .select('title')
      .text(d => d.label)

    this.nodeWrap.exit().remove()

    const nodeWrapEnter = this.nodeWrap.enter()

    nodeWrapEnter
      .append('g')
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
    this.linkWrap = d3.select('#allLink').selectAll('g').data(links, d => d.id)

    this.linkWrap
      .select('line')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.width)
      .attr('stroke-opacity', d => d.opacity)

    this.linkWrap.exit().remove()

    let linkWrapEnter = this.linkWrap.enter()

    linkWrapEnter
      .append('g')
      .append('line')
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

  convertInfo = createTransformer(({ info, selectedHeroes, selectHero, styles }) => {
    const nodes = info.nodes.map(item => ({
      label: `${item.hero.name}`,
      r: item.pick > 20 ? 35 : 25 + Math.ceil(item.pick / 2),
      color: getWinRateColor(item.win / item.pick),
      id: item.hero.id,
      src: item.hero.icon,
      array: selectedHeroes.find(hero => hero.id == item.hero.id) ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI / 8 : 0,
      offset: selectedHeroes.find(hero => hero.id == item.hero.id)  ? (item.pick > 20 ? 25 : 25 + Math.ceil(item.pick / 2)) * Math.PI : 0,
      class: selectedHeroes.find(hero => hero.id == item.hero.id)  ? styles.selectedHero : styles.hero,
      opacity: 1,
      onClick: () => selectHero(item.hero)
    }))



    // for (let i = 0; i < this.nodes.length; i++) {
    //   const index = nodes.findIndex(node => node.id == this.nodes[i].id)
    //   if (index == -1) {
    //     this.nodes.splice(i, 1)
    //     i--
    //   }

    //   else {
    //     this.nodes[i].r = nodes[index].r
    //     this.nodes[i].color = nodes[index].color
    //     this.nodes[i].array = nodes[index].array
    //     this.nodes[i].offset = nodes[index].offset
    //     this.nodes[i].class = nodes[index].class
    //   }
    // }

    // nodes.map(node => {
    //   const index = this.nodes.findIndex(item => item.id == node.id)
    //   if (index == -1) this.nodes.push(node)
    // })

    this.nodes = nodes

    const links = info.links
      .filter(item => item.pick > 1)
      .filter(item => !selectedHeroes.includes(item.source) && !selectedHeroes.includes(item.target))
      .map(item => ({
        id: item.id,
        source: this.nodes.findIndex(node => node.id == item.source.id),
        target: this.nodes.findIndex(node => node.id == item.target.id),
        color: getWinRateColor(item.win / item.pick),
        width: 3,
        opacity: item.pick * 0.2
      }))

    return { nodes, links }
  })

  render (props) {
    const { nodes, links } = this.convertInfo(props)

    this.generateLinks(links)
    this.generateDefs(this.nodes)
    this.generateNodes(nodes)

    this.simulation
      .nodes(nodes)
      .on('tick', this.tick)

    this.simulation.force('link').links(links)
    this.simulation.alpha(1).restart()
  }
}