import * as d3 from 'd3'

const width = 800
const height = 600
const margin = { top: 0, left: 0, bottom: 0, right: 0 }
const chartWidth = width - (margin.left + margin.right)
const chartHeight = height - (margin.top + margin.bottom)

let simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.index))
  .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
  .force('y', d3.forceY(0))
  .force('x', d3.forceX(0))

let nodeWrap
let defsWrap
let linkWrap
let id = -1

function createDrag (simulation) {
  function dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged (d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const drag = createDrag(simulation)

function generateNodes (nodes) {
  const nodeG = d3.select('#allNode')
  nodeWrap = nodeG.selectAll('circle').data(nodes, d => d.id)

  nodeWrap.exit().remove()
  let nodeWrapEnter = nodeWrap.enter()

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
    .call(drag)
    .append('title')
    .text(d => d.label)

  nodeWrap
    .attr('r', d => d.r)
    .attr('fill', d => 'url(#img' + d.id + ')')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 3)
    .attr('stroke-opacity', d => d.opacity)
    .attr('stroke-dasharray', d => d.array)
    .attr('stroke-dashoffset', d => d.offset)
    .attr('class', d => d.class)
    .on('click', d => d.onClick())
    .call(drag)
    .select('title')
    .text(d => d.label)

  nodeWrap = nodeWrapEnter.merge(nodeWrap)
}

function generateDefs (nodes) {
  const defsG = d3.select('#allPattern')
  defsWrap = defsG.selectAll('pattern').data(nodes, d => d.id)

  defsWrap
    .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
    .select('image')
    .attr('xlink:href', d => d.src)
    .attr('x', d => d.r - 16)
    .attr('y', d => d.r - 16)

  defsWrap.exit().remove()
  let defsWrapEnter = defsWrap.enter()

  defsWrapEnter
    .append('pattern')
    .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
    .append('image')
    .attr('xlink:href', d => d.src)
    .attr('x', d => d.r - 16)
    .attr('y', d => d.r - 16)

  defsWrap = defsWrapEnter.merge(defsWrap)
}

function generateLinks (links) {
  const linkG = d3.select('#allLink')
  linkWrap = linkG.selectAll('line').data(links, d => d.id)

  // .select('title')
  // .text(d => d.label)
  linkWrap.exit().remove()
  let linkWrapEnter = linkWrap.enter()

  linkWrapEnter
    .append('line')
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => d.width)
    .attr('stroke-opacity', d => d.opacity)

  linkWrap
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => d.width)
    .attr('stroke-opacity', d => d.opacity)
  // .append('title')
  // .text(d => d.label)

  linkWrap = linkWrapEnter.merge(linkWrap)
}

export default (_nodes, _links) => {
  const nodes = [..._nodes, {
    label: 'ghost',
    r: 0,
    color: 0,
    id: id + '-ghost-node',
    src: '',
    width: 0,
    array: 0,
    offset: 0,
    class: 'ghost',
    opacity: 0,
    onClick: () => {}
  }]

  const links = [..._links, {
    id: id + '-ghost-line',
    source: nodes.length - 1,
    target: nodes.length - 1,
    color: 'transparent',
    width: 0,
    opacity: 0
  }]

  id--

  generateLinks(links)
  generateDefs(nodes)
  generateNodes(nodes)

  const ticked = function () {
    linkWrap
      .selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    nodeWrap
      .selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  }

  simulation
    .nodes(nodes)
    .on('tick', ticked)

  simulation.force('link').links(links)
  simulation.alpha(1).restart()
}