import React from "react";
import { contourDensity } from "d3-contour";
import Paths from "./paths";

const contours = (props) => {
  return contourDensity()
    .x(d => props.xScale(d.location_x))
    .y(d => props.yScale(d.location_z))
    .size([props.width, props.height])
    .bandwidth(10)(props.data)
}

export default (props) => {
  return <Paths contours={contours(props)} />
}
