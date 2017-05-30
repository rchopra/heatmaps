import React, { Component } from "react";
import { range } from "d3-array";
import { interpolateHslLong } from "d3-interpolate";
import { legendColor } from "d3-svg-legend";
import { scaleSequential } from "d3-scale";
import { select } from "d3-selection";
require("d3-transition");

export default class Axis extends Component {
  componentDidMount() {
    this.renderLegend();
  }

  componentDidUpdate() {
    this.renderLegend();
  }

  renderLegend() {
    const node  = this.refs.legend;
    const colorScale = scaleSequential(interpolateHslLong("blue", "red"))
      .domain([0,10])

    const minVal = this.props.contour_extent[0]
    const maxVal = this.props.contour_extent[1]
    const step = (maxVal - minVal) / 4;
    let labels = range(minVal, maxVal, step)
    labels.push(maxVal);

    const legend = legendColor()
     .shapeWidth(30)
     .orient("horizontal")
     .scale(colorScale)
     .labels(labels);

    select(node)
      .attr("class", "legendSequential")
      .call(legend);
  }
  render() {
    return <g ref="legend" transform={this.props.translate}></g>
  }
}
