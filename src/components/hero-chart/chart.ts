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

export default (nodes, links) => {
  const width = 800
  const height = 600
  const margin = { top: 0, left: 0, bottom: 0, right: 0 }
  const chartWidth = width - (margin.left + margin.right)
  const chartHeight = height - (margin.top + margin.bottom)

  d3.selectAll('svg').remove()
  let svg = d3.select('#graph').append('svg')
  let chartLayer = svg.append('g').classed('chartLayer', true)

  svg
    .attr('width', width).attr('height', height)

  chartLayer
    .attr('width', chartWidth).attr('height', chartHeight).attr('transform', 'translate(' + [margin.left, margin.top] + ')')

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.index))
    .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
    .force('y', d3.forceY(0))
    .force('x', d3.forceX(0))

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', d => d.color).attr('stroke-width', d => d.width).attr('stroke-opacity', 0.4)

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', d => d.r).attr('fill', d => 'url(#img' + d.id + ')').attr('stroke', d => d.color).attr('stroke-width', d => 3).attr('stroke-opacity', 1)
    .on('click', d => console.log(d.label))
    .call(createDrag(simulation))

  svg.append('defs')
    .selectAll('pattern')
    .data(nodes)
    .enter()
    .append('pattern')
    .attr('id', d => 'img' + d.id).attr('width', 1).attr('height', 1)
    .append('image')
    .attr('xlink:href', d => d.src).attr('x', d => d.r - 16).attr('y', d => d.r - 16)

  node.append('title').text(d => d.label)

  link.append('title').text(d => d.label)

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