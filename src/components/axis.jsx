import React, { Component } from "react";
import {select} from "d3-selection";
import "d3-selection-multi";

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    var node  = this.refs.axis;
    select(node)
      .call(this.props.axisFunction(this.props.scale).ticks(null, this.props.tickFormat))
      .select(".tick:last-of-type text")
        .attrs(this.props.labelAttrs)
        .text(this.props.label);
  }

  render() {
    return <g ref="axis" transform={this.props.translate}></g>
  }
}
