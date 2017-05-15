import React from 'react';

const renderZone = (props) => {
  const points = [
    props.x(-.7083),
    props.y(3.5),
    props.x(.7083),
    props.y(3.5),
    props.x(.7083),
    props.y(1.5),
    props.x(-.7083),
    props.y(1.5),
  ];
  return <polygon stroke={"gray"} fill={"none"} points={points} />
}

export default (props) => {
  return <g>{renderZone(props)}</g>
}
