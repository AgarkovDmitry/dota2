import * as d3 from 'd3'

import Node from './node'
import Link from './link'
import Draft from 'store/types/draft'
import Hero from 'store/types/hero'

export default class D3Team {
  simulation

  nodeWrap
  defsWrap
  linkWrap

  drafts: Array<Draft>
  nodes: Array<Node>
  links: Array<Link>

  outfilteredNodes: Array<Node>
  outfilteredLinks: Array<Link>

  drag

  constructor () {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.index))
      .force('collide', d3.forceCollide(d => d.r + 12).iterations(16))
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
    this.outfilteredNodes = []
    this.outfilteredLinks = []
    this.drafts = []

    this.drag = d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  generateNodes () {
    this.nodeWrap = d3.select('#allNode').selectAll('g').data(this.nodes, d => d.id)

    this.nodeWrap
      .select('circle')
      .attr('class', (node: Node) => node.class)
      .transition()
        .duration(750)
        .attr('r', (node: Node) => node.r)
        .attr('fill', (node: Node) => 'url(#img' + node.hero.id + ')')
        .attr('stroke', (node: Node) => node.color)
        .attr('stroke-dasharray', (node: Node) => node.array)
        .attr('stroke-dashoffset', (node: Node) => node.offset)

    this.nodeWrap
      .exit()
      .remove()

    const nodeWrapEnter = this.nodeWrap.enter()

    nodeWrapEnter
      .append('g')
      .append('circle')
      .attr('class', (node: Node) => node.class)
      .transition()
        .duration(750)
        .attr('r', (node: Node) => node.r)
        .attr('fill', (node: Node) => 'url(#img' + node.hero.id + ')')
        .attr('stroke', (node: Node) => node.color)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', (node: Node) => node.array)
        .attr('stroke-dashoffset', (node: Node) => node.offset)

    nodeWrapEnter
      .selectAll('g')
      .select('circle')
      .on('click', (node: Node) => node.click(node.hero))
      .call(this.drag)
      .append('title')
      .text((node: Node) => node.name)

      this.nodeWrap = nodeWrapEnter.merge(this.nodeWrap)
  }

  generateDefs () {
    this.defsWrap = d3.select('#allPattern').selectAll('pattern').data(this.nodes, d => d.id)

    this.defsWrap
      .attr('id', (node: Node) => 'img' + node.hero.id).attr('width', 1).attr('height', 1)
      .select('image')
      .attr('xlink:href', (node: Node) => node.icon)
      .transition()
        .duration(750)
        .attr('x', (node: Node) => node.r - 16)
        .attr('y', (node: Node) => node.r - 16)

    this.defsWrap.exit().remove()
    let defsWrapEnter = this.defsWrap.enter()

    defsWrapEnter
      .append('pattern')
      .attr('id', (node: Node) => 'img' + node.hero.id).attr('width', 1).attr('height', 1)
      .append('image')
      .attr('xlink:href', (node: Node) => node.icon)
      .transition()
        .duration(750)
        .attr('x', (node: Node) => node.r - 16)
        .attr('y', (node: Node) => node.r - 16)

    this.defsWrap = defsWrapEnter.merge(this.defsWrap)
  }

  generateLinks () {
    this.linkWrap = d3.select('#allLink').selectAll('g').data(this.links, d => d.id)

    this.linkWrap
      .select('line')
      .transition()
        .duration(750)
        .attr('stroke', d => d.color)
        .attr('stroke-opacity', d => d.opacity)

    this.linkWrap.exit().remove()

    let linkWrapEnter = this.linkWrap.enter()

    linkWrapEnter
      .append('g')
      .append('line')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => 2)
      .transition()
        .duration(750)
        .attr('stroke-opacity', d => d.opacity)

    this.linkWrap = linkWrapEnter.merge(this.linkWrap)
  }

  mergeNodes(oldDrafts: Array<Draft>, newDrafts: Array<Draft>, select: Function, heroes: Array<Hero>, filter) {
    const { mPicks, lPicks, mWinRate, lWinRate, players } = filter

    this.nodes.push(...this.outfilteredNodes)
    this.outfilteredNodes = []

    this.nodes.map(node => node.removeOldDrafts(oldDrafts))

    for (let k = 0; k < this.nodes.length; k++) {
      if (!this.nodes[k].drafts.length) {
        this.nodes.splice(k, 1)
        k--
      }
    }

    newDrafts.map(draft =>
      draft.picks.map(pick =>
        ! this.nodes.find(node => node.hero == pick.hero)
        && this.nodes.push(new Node(pick.hero, select))
      )
    )

    this.nodes.map(node => node.appendNewDrafts(newDrafts))

    for (let i = 0; i < this.nodes.length; i++) {
      if (mPicks && this.nodes[i].picks <= mPicks) this.outfilteredNodes.push(...this.nodes.splice(i--, 1))
      else if (lPicks && this.nodes[i].picks >= lPicks) this.outfilteredNodes.push(...this.nodes.splice(i--, 1))
      else if (mWinRate && this.nodes[i].winRate <= mWinRate) this.outfilteredNodes.push(...this.nodes.splice(i--, 1))
      else if (lWinRate && this.nodes[i].winRate >= lWinRate) this.outfilteredNodes.push(...this.nodes.splice(i--, 1))
      else if (players) {

      //   (players.includes(this.nodes[i].drafts[0].picks[0].player) || outHeroes.includes(this.links[i]._target))
      // ) this.outfilteredLinks.push(...this.nodes.splice(i--, 1))
      }
    }

    this.nodes.map(node => node.selection(heroes))
  }

  mergeLinks(oldDrafts: Array<Draft>, newDrafts: Array<Draft>, filter) {
    const { mPicks, lPicks, mWinRate, lWinRate, outHeroes } = filter

    this.links.push(...this.outfilteredLinks)
    this.outfilteredLinks = []

    this.links.map(link => link.removeOldDrafts(
      oldDrafts,
      this.nodes.findIndex(item => item.id == link._source.id),
      this.nodes.findIndex(item => item.id == link._target.id)
    ))

    for (let k = 0; k < this.links.length; k++) {
      if (!this.links[k].drafts.length) {
        this.links.splice(k, 1)
        k--
      }
    }

    newDrafts.map(draft =>
      draft.pairs.map(pair =>
        ! this.links.find(link => link._source == pair.source && link._target == pair.target)
        && this.links.push(new Link(pair.source.hero, pair.target.hero))
      )
    )

    this.links.map(link => link.appendNewDrafts(
      newDrafts,
      this.nodes.findIndex(item => item.id == link._source.id),
      this.nodes.findIndex(item => item.id == link._target.id)
    ))

    for (let i = 0; i < this.links.length; i++) {
      if (mPicks && this.links[i].picks <= mPicks) this.outfilteredLinks.push(...this.links.splice(i--, 1))
      else if (lPicks && this.links[i].picks >= lPicks) this.outfilteredLinks.push(...this.links.splice(i--, 1))
      else if (mWinRate && this.links[i].winRate <= mWinRate) this.outfilteredLinks.push(...this.links.splice(i--, 1))
      else if (lWinRate && this.links[i].winRate >= lWinRate) this.outfilteredLinks.push(...this.links.splice(i--, 1))
      else if (outHeroes &&
        (outHeroes.includes(this.links[i]._source) || outHeroes.includes(this.links[i]._target))
      ) this.outfilteredLinks.push(...this.links.splice(i--, 1))
    }
  }

  render (heroes: Array<Hero>, select: Function, drafts: Array<Draft>) {
    const oldDrafts = this.drafts.filter(
      item => !drafts.find(match => match == item)
    )

    const newDrafts = drafts.filter(
      item => !this.drafts.find(match => match == item)
    )

    this.drafts = drafts

    this.mergeNodes(oldDrafts, newDrafts, select, heroes, {
      mPicks: 1,
      lPicks: null,
      mWinRate: null,
      lWinRate: null,
      players: null
    })

    this.mergeLinks(oldDrafts, newDrafts, {
      mPicks: 1,
      lPicks: null,
      mWinRate: null,
      lWinRate: null,
      outHeroes: heroes
    })

    this.generateLinks()
    this.generateDefs()
    this.generateNodes()

    this.simulation
      .nodes(this.nodes)
      .on('tick', () => {
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
      })

    this.simulation.force('link').links(this.links)
    this.simulation.alpha(1).restart()
  }
}