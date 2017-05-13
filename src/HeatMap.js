import React, { Component } from 'react';
import './App.css';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { extent } from 'd3-array';
import { select } from 'd3-selection';
import { contourDensity } from 'd3-contour';
import { geoPath } from 'd3-geo';
import { interpolateRgb } from 'd3-interpolate';

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.createHeatMap = this.createHeatMap.bind(this);
  }

  componentDidMount() {
    this.createHeatMap()
  }

  componentDidUpdate() {
    this.createHeatMap()
  }

  createHeatMap() {
    const node = this.node;
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = this.props.size[0];
    const height = this.props.size[1];

    const color = scaleSequential(interpolateRgb("white", "red")).domain([0, .08]);

    const x = scaleLinear()
      .domain(extent(this.props.data, d => d.location_x)).nice()
      .rangeRound([margin.left, width - margin.right]);

    const y = scaleLinear()
      .domain(extent(this.props.data, d => d.location_z)).nice()
      .rangeRound([height - margin.bottom, margin.top]);

    select(node)
      .selectAll("path")
      .data(contourDensity()
        .x(d => x(d.location_x))
        .y(d => y(d.location_z))
        .size([width, height])
        .bandwidth(10)(this.props.data)
      )
      .enter()
      .append("path")
      .attr("fill", d => {
        console.log(d.value);
        return color(d.value);
      })
      .attr("d", geoPath());

    const points = [x(-.7083), y(3.5), x(.7083), y(3.5), x(.7083), y(1.5), x(-.7083), y(1.5)]
    select(node)
      .append("polygon")
      .style("stroke", "gray")
      .style("fill", "none")
      .attr("points", points)

      // select(node)
      //   .append("g")
      //   .attr("stroke", "white")
      //   .selectAll("circle")
      //   .data(this.props.data)
      //   .enter().append("circle")
      //   .attr("cx", function(d) { return x(d.location_x); })
      //   .attr("cy", function(d) { return y(d.location_z); })
      //   .attr("r", 2);
  }

  render() {
    return <svg ref={node => this.node = node}
            width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default HeatMap
