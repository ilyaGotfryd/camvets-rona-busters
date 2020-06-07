import React, { Component } from 'react';
import './App.css';
import { spaces, counts } from './api/spaces';
import SpacesCards from './components/spaceCards';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { demo_now } from './services/demoTimeService';

class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      spaces: []
    }
    this._cleaning_events = {}
  }

  getLatestSpaceCleanedEvent(space_id){
    // if there is no event add one that was an hour ago
    // else return one for this space
    if (!this._cleaning_events[space_id]){
      let start_time = new Date(demo_now().getTime() - 3*60*60*1000)
      let done_time = new Date(demo_now().getTime() - 3*60*60*1000)
      this._cleaning_events[space_id] = {time: done_time, start_time: start_time };
    }
    return this._cleaning_events[space_id]
  }

  addSpaceCleanedEvent(space_id){
    this._cleaning_events[space_id] = {...this._cleaning_events[space_id], time: new Date(demo_now() - 1000), cleaningInProgress: false }
  }

  addStartCleaningEvent(space_id){
    this._cleaning_events[space_id] = {...this._cleaning_events[space_id], start_time: demo_now() , cleaningInProgress: true }
    return this._cleaning_events[space_id];
  }

  fetchEntrCounts(space){
      let last_cleaned_event = this.getLatestSpaceCleanedEvent(space.id)
      counts(space.id, last_cleaned_event.time.toISOString(), demo_now().toISOString())
      .then(
        counts_resp => {
          let count = 0
          counts_resp.data.results.forEach(result=> count += result.interval.analytics.entrances)
          let _spaces = this.state.spaces.filter(value => value.id !== space.id )
          _spaces = [..._spaces, {
              id: space.id, 
              name: space.name,
              count: count,
              cleaningInProgress:last_cleaned_event.cleaningInProgress,
              start_time: last_cleaned_event.start_time
             }]
          _spaces.sort((a, b) => (a.count > b.count) ? -1 : 1)
          this.setState({spaces: _spaces})
        }
      )
  }

  fetchEntrCountsInSpaces(){
    spaces()
    .then(resp => {
        resp.data.results.forEach(space => { if (space.space_type !== "building"){ this.fetchEntrCounts(space) };});
    });
  }

  componentDidMount(){
    this.fetchEntrCountsInSpaces();
    let _this = this;
    setInterval(function(){
      _this.fetchEntrCountsInSpaces()
    }, 20*1000)
  }

  spaceCleared( space_id ){
    this.addSpaceCleanedEvent(space_id);
    let _space = {}
    this.state.spaces.forEach(space => _space = (space.id === space_id)?space:_space )
    this.fetchEntrCounts(_space);
  }

  startCleaning(space_id){
    let event = this.addStartCleaningEvent(space_id);
    let _spaces = [...this.state.spaces]
    let _space_index = -1
    _spaces.forEach((space, i) => _space_index = (space.id === space_id)?i:_space_index )
    _spaces[_space_index] = {..._spaces[_space_index], start_time: event.start_time , cleaningInProgress: event.cleaningInProgress }
    this.setState({spaces: _spaces})
  }

  render(){
    let header = {textAlign: "center", fontFamily:"Impact,Charcoal,sans-serif"}
    let subHeader = {textAlign: "center"}
    return (
      <div className="App">
        <br/>
        <Container>
          <h2 style={header}>RONA BUSTERS</h2>
          <h4 style={subHeader}>Hight touch surface cleaning</h4>
          <SpacesCards spaces={this.state.spaces} onSpaceCleared={ id => this.spaceCleared(id) } onStartCleaning={ id => this.startCleaning(id)}/>
        </Container>
      </div>
    );
  }
}

export default App;
