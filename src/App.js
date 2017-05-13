import React, { Component } from 'react';
import './App.css';
import pitchData from './lester';
import HeatMap from './HeatMap';

class App extends Component {
  render() {
    const pitches = pitchData.pitches;
    return (
      <div className="App">
        <HeatMap size={[800, 800]} data={pitches} />
      </div>
    );
  }
}

export default App;

