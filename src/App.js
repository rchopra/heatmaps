import React, { Component } from "react";
import "./App.css";
import logo from "./cubs_logo.svg";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { Button, ButtonGroup } from "react-bootstrap";
import pitchData from "./lester";
import HeatMap from "./components/heatmap.jsx";

const pitches = pitchData
  .pitches
  .filter(d => d.location_z > 0 && d.pitch_type !== "IB");
const pitchTypes = ["All", ...new Set(pitches.map(d => d.pitch_type))]
const pitchTypeMap = {
  All: "All Pitches",
  FA: "4-Seam Fastball",
  FC: "Cutter",
  SI: "Sinker",
  CU: "Curveball",
  CH: "Changeup"
}
const handednessMap = {
  vsLR: "vs All Batters",
  vsL: "vs LHB",
  vsR: "vs RHB",
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.filterByPitchType = this.filterByPitchType.bind(this);
    this.filterByHand = this.filterByHand.bind(this);
    this.togglePitchOverlay = this.togglePitchOverlay.bind(this);
    this.state = {
      screenWidth: 1,
      screenHeight: 1,
      data: pitches,
      selectedPitchType: "All",
      selectedHand: "vsLR",
      overlayPitches: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize, false);
    this.onResize();
  }

  onResize() {
    this.setState({screenWidth: window.innerWidth - 80, screenHeight: window.innerHeight - 200});
  }

  filterByPitchType(pitchType) {
    const filtered_pitches = this.filterPitches(pitchType, this.state.selectedHand);
    this.setState({ data: filtered_pitches, selectedPitchType: pitchType });
  }

  filterByHand(event) {
    const selectedHand = event.target.id;
    const filtered_pitches = this.filterPitches(this.state.selectedPitchType, selectedHand);
    this.setState({ data: filtered_pitches, selectedHand: selectedHand });
  }

  filterPitches(pitchType, selectedHand) {
    return pitches.filter(d => {
      return selectedHand.includes(d.batter_side) &&
             (pitchType === "All" || d.pitch_type === pitchType)
    });
  }

  togglePitchOverlay(event) {
    this.setState({ overlayPitches: !this.state.overlayPitches });
  }

  createTitle() {
    const count = this.state.data.length
    const pitchName = pitchTypeMap[this.state.selectedPitchType];
    const batterHand = handednessMap[this.state.selectedHand];
    return (
      <div className="title-container">
        <span className="title">{"Jon Lester " + pitchName + " " + batterHand}</span><br />
        <span className="sub-title">{"pitcher's perspective (n=" + count + ")"}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="header-text">Pitch Location Heatmaps</span>
        </div>
        <div className="filter-controls">
          <DropdownButton
            id="pitchTypeDropdown"
            title={pitchTypeMap[this.state.selectedPitchType]}
            onSelect={this.filterByPitchType}>
            {pitchTypes.map((d, i) => <MenuItem key={i} eventKey={d}>{pitchTypeMap[d]}</MenuItem>) }
          </DropdownButton>
          {" "}
          <ButtonGroup>
            <Button
              onClick={this.filterByHand}
              id="vsLR"
              active={this.state.selectedHand === "vsLR"}>vs All</Button>
            <Button
              onClick={this.filterByHand}
              id="vsL"
              active={this.state.selectedHand === "vsL"}>vs L</Button>
            <Button
              onClick={this.filterByHand}
              id="vsR"
              active={this.state.selectedHand === "vsR"}>vs R</Button>
          </ButtonGroup>
          {" "}
          <Button
            active={this.state.overlayPitches}
            id="pitchOverlay"
            onClick={this.togglePitchOverlay}>Pitch Overlay</Button>
        </div>
        <div>
          {this.createTitle()}
          <HeatMap
            data={this.state.data}
            height={this.state.screenHeight}
            width={this.state.screenWidth}
            renderOverlay={this.state.overlayPitches} />
        </div>
      </div>
    );
  }
}

export default App;

