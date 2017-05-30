import React, { Component } from "react";
import { ListGroup, ListGroupItem, Pagination } from "react-bootstrap";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import { Grid, Row, Col } from "react-bootstrap";
import ReactPlayer from 'react-player'
import {search} from "./../services/pitchql"

const pitchTypeMap = {
  All: "All Pitches",
  FA: "4-Seam Fastball",
  FC: "Cutter",
  SI: "Sinker",
  CU: "Curveball",
  CH: "Changeup"
}

const videoHeading = function(pitch) {
  return `${pitch.pitcher_name} vs ${pitch.batter_name} (${pitch.batting_team_abbr})`
}

const videoDescription = function(pitch) {
  return `${pitchTypeMap[pitch.pitch_type]} ${pitch.velocity} mph - ${pitch.game_date}`
}

export default class VideoSearch extends Component {
  constructor(props) {
    super(props);
    this.setSelectedVideo = this.setSelectedVideo.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterPitches = this.filterPitches.bind(this);
    this.state = {
      query: "",
      selectedVideo: "",
      activePage: 1,
      filteredPitches: [],
      selectedPagePitches: [],
      numPages: 0
    };
  }

  handleSelect(eventKey) {
    const allPitches = this.state.filteredPitches;
    const pitchesToDisplay = this.paginationSet(eventKey, allPitches)
    this.setState({
      activePage: eventKey,
      selectedPagePitches: pitchesToDisplay,
    });
  }

  paginationSet(page, selectedPitches){
    var numPerPage = 10;
    var index = numPerPage * (page - 1);
    return selectedPitches.slice(index, index+numPerPage);
  }

  setSelectedVideo(pitch_id) {
    const pitch = this.props.data.find(d => d.pitch_id === pitch_id)
    this.setState({ selectedVideo: pitch.video });
  }

  handleChange(event) {
    this.setState({query: event.target.value});
  }

	filterPitches(event) {
		// Don't POST and reload the page onSubmit
		event.preventDefault();
    const results = search(this.props.data, this.state.query);
    this.setState({
      filteredPitches: results,
      selectedPagePitches: results.slice(0, 10),
      numPages: Math.ceil(results.length / 10)
    });
	}

  render() {
    return <div>
      <br />
      <Grid>
      <Row>
        <Col>
          <Form horizontal onSubmit={this.filterPitches}>
            <FormGroup>
              <Col sm={10}>
                <FormControl
                  value={this.state.query}
                  onChange={this.handleChange}
                  type="text" placeholder="Search" />
              </Col>
              <Col sm={2}>
                <Button type="submit">Get Videos</Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col sm={5}>
        <div>
          <ListGroup>
            { this.state.selectedPagePitches.map((d, i) => {
              return <ListGroupItem
                onClick={() => this.setSelectedVideo(d.pitch_id)}
                key={i}
                id={d.pitch_id}
                header={videoHeading(d)}>{videoDescription(d)}</ListGroupItem>
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
               </div>
        </Col>
        <Col sm={7}>
          <ReactPlayer playing controls url={this.state.selectedVideo} />
        </Col>
      </Row>
      </Grid>
    </div>
  }
}
