import React from "react";
import { geoPath } from "d3-geo";
import { interpolateHslLong } from "d3-interpolate";
import { scaleSequential } from "d3-scale";
import { extent } from "d3-array";

const color = (contours) => {
  return scaleSequential(interpolateHslLong("blue", "red"))
    .domain(extent(contours, d => d.value));
}

const renderPaths = (props) => {
  return props.contours.map((d, i) => {
    return <path key={"path" + i} d={geoPath()(d)} fill={color(props.contours)(d.value)} />
  });
}

export default (props) => {
  return <g>{renderPaths(props)}</g>
}
