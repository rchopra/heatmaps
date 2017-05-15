import React from 'react';

const renderCircles = (props) => {
  return (d, i) => {
    const circleProps = {
      cx: props.xScale(d.location_x),
      cy: props.yScale(d.location_z),
      r: 2,
      key: i
    };
    return <circle {...circleProps} />;
  };
};

export default (props) => {
  return <g>{ props.data.map(renderCircles(props)) }</g>
}
