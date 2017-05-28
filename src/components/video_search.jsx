import React, { Component } from "react";
import { ListGroup, ListGroupItem, Pagination } from "react-bootstrap";
import ReactPlayer from 'react-player'

const pitchTypeMap = {
  All: "All Pitches",
  FA: "4-Seam Fastball",
  FC: "Cutter",
  SI: "Sinker",
  CU: "Curveball",
  CH: "Changeup"
}

const videoTitle = function(pitch) {
  return `${pitch.pitcher_name} vs ${pitch.batter_name} (${pitch.batting_team_abbr}): ${pitchTypeMap[pitch.pitch_type]} ${pitch.velocity}mph - ${pitch.game_date}`
}

export default class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.setSelectedVideo = this.setSelectedVideo.bind(this);
    this.handleSelect= this.handleSelect.bind(this);
    this.state = {
      selectedVideo: "",
      activePage: 1,
      selectedPagePitches: this.props.data.slice(0,10),
      numPages: Math.ceil(this.props.data.length / 10)
    };
  }

  handleSelect(eventKey) {
    const allPitches = this.props.data;
    const pitchesToDisplay = this.paginationSet(eventKey, allPitches)
    this.setState({ activePage: eventKey, selectedPagePitches: pitchesToDisplay });
  }

  paginationSet(page, selectedPitches){
    var numPerPage = 10;
    var index = numPerPage * (page - 1);
    return selectedPitches.slice(index, index+numPerPage);
  }

  setSelectedVideo(event) {
    const pitch = this.props.data.find(d => `${d.pitch_id}` === event.target.id)
    this.setState({ selectedVideo: pitch.video });
  }

  render() {
    return <div>
      <ListGroup id="1">
        { this.state.selectedPagePitches.map((d, i) => {
          return <ListGroupItem onClick={this.setSelectedVideo} key={i} id={d.pitch_id}>{videoTitle(d)}</ListGroupItem> 
        })}
      </ListGroup>
      <Pagination
         prev
         next
         first
         last
         ellipsis
         boundaryLinks
         items={this.state.numPages}
         maxButtons={5}
         activePage={this.state.activePage}
         onSelect={this.handleSelect} />
      <ReactPlayer playing controls url={this.state.selectedVideo} />
    </div>
  }
}
