import React, { Component } from "react";
import { axisBottom, axisLeft } from "d3-axis";
import { contourDensity } from "d3-contour";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import Contours from "./contours";
import Axis from "./axis";
import Legend from "./legend";
import StrikeZone from "./strike_zone";
import Scatter from "./scatter";

const styles = {
  margin_top: 30,
  margin_right: 30,
  margin_bottom: 30,
  margin_left: 30,
  legend_width: 30
}

const xScale = (props) => {
  return scaleLinear()
    .domain([-3.0, 3.0])//extent(props.data, d => d.location_x)).nice()
    .rangeRound([styles.margin_left, props.width - styles.margin_right]);
}

const yScale = (props) => {
  return scaleLinear()
    .domain([0.0, 5.0])//extent(props.data, d => d.location_z)).nice()
    .rangeRound([props.height - styles.margin_bottom, styles.margin_top]);
}

export default class HeatMap extends Component {
  pitchOverlay() {
    if (this.props.renderOverlay) {
      return <Scatter
        data={this.props.data}
        xScale={xScale(this.props)}
        yScale={yScale(this.props)}
        height={this.props.height}
        width={this.props.width} />
    }
    return "";
  }

  contours() {
    return contourDensity()
      .x(d => xScale(this.props)(d.location_x))
      .y(d => yScale(this.props)(d.location_z))
      .size([this.props.width, this.props.height])
      .bandwidth(10)(this.props.data)
  }

  render() {
    const xSettings = {
      axisFunction: axisBottom,
      scale: xScale(this.props),
      tickFormat: ".1f",
      translate: `translate(0, ${(this.props.height - styles.margin_bottom)})`,
      labelAttrs: {
        "y": -3,
        "dy": null,
        "font-weight": "bold",
      },
      label: "Feet"
    };

    const ySettings = {
      axisFunction: axisLeft,
      scale: yScale(this.props),
      tickFormat: ".1s",
      translate: `translate(${styles.margin_left}, 0)`,
      labelAttrs: {
        "x": 3,
        "text-anchor": "start",
        "font-weight": "bold",
      },
      label: "Feet"
    };

    const legendSettings = {
      translate: `translate(${(this.props.width - styles.margin_right - 5*styles.legend_width)}, 0)`,
      contour_extent: extent(this.contours(), d => {
        return Math.round(d.value * Math.pow(this.props.width*this.props.height, 0.5), 1);
      })
    };

    return <svg width={this.props.width} height={this.props.height}>
      <Contours
        height={this.props.height}
        width={this.props.width}
        data={this.props.data}
        xScale={xScale(this.props)}
        yScale={yScale(this.props)}
        {...styles} />
      {this.pitchOverlay()}
      <Axis {...xSettings} />
      <Axis {...ySettings} />
      <Legend {...legendSettings} />
      <StrikeZone x={xScale(this.props)} y={yScale(this.props)} />
    </svg>
  }
}
