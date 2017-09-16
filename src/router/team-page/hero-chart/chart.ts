import * as d3 from 'd3'

function createDrag(simulation) {
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

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

function renderLinks(parent, data) {
  const link = parent.append('g')
  .attr('class', 'links')
  .selectAll('line')
  .data(data)
  .enter()
  .append('line')
  .attr('stroke', d => d.color)
  .attr('stroke-width', d => d.width)
  .attr('stroke-opacity', d => d.opacity)

  link.append('title').text(d => d.label)

  return link
}

function renderNodes(parent, data, drag) {
  const node = parent.append('g')
  .attr('class', 'nodes')
  .selectAll('circle')
  .data(data)
  .enter()
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

  node.append('title').text(d => d.label)

  return node
}

function renderImages(parent, data) {
  const def = parent.append('defs')
  .selectAll('pattern')
  .data(data)
  .enter()
  .append('pattern')
  .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
  .append('image')
  .attr('xlink:href', d => d.src).attr('x', d => d.r - 16).attr('y', d => d.r - 16)

  return def
}

const resetSVG = () => {
  d3.selectAll('defs').remove()
  d3.selectAll('.nodes').remove()
  d3.selectAll('.links').remove()
}

const createSimulation = () => {
  const width = document.getElementById('graph').clientWidth
  const height = document.getElementById('graph').clientHeight
  const margin = { top: 0, left: 0, bottom: 0, right: 0 }
  const chartWidth = width - (margin.left + margin.right)
  const chartHeight = height - (margin.top + margin.bottom)

  const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.index))
  .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
  .force('y', d3.forceY(0))
  .force('x', d3.forceX(0))

  return simulation
}

const render = (simulation, nodes, links) => {
  let svg = d3.select('#graph')

  const drag = createDrag(simulation)

  const link = renderLinks(svg, links)
  const node = renderNodes(svg, nodes, drag)
  renderImages(svg, nodes)

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
      .nodes(nodes)
      .on('tick', ticked)

  simulation.force('link').links(links)
}

export default {
  resetSVG,
  createSimulation,
  render
}