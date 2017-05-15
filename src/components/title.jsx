import React from 'react';

const renderTitle = (props) => {
  console.log(props);
  return <text>{props.text}</text>
};

const renderSubTitle = () => {
  return <text>"pitcher's perspective"</text>
}

export default (props) => {
  console.log(props);
  return <g transform={props.translate}>
    {renderTitle(props)}
    {renderSubTitle}
  </g>
}
