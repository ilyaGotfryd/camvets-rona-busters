import React, { Component } from 'react';
import './App.css';
import { spaces, counts } from './api/spaces';
import SpacesCards from './components/spaceCards';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { demo_now } from './services/demoTimeService';
import log_image from './resources/rona_busters.png';

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
          _spaces.sort((a, b) => (a.count > b.count) ? -1 : (a.count === b.count && a.name.toUpperCase() < b.name.toUpperCase())? -1 : 1)
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
    }, 7*1000)
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
    let subHeader = {textAlign: "center", color:"#9e9e9e", paddingTop:"10px"}
    let logoStyle = {width: "30px", height:"30px", marginBottom:"5px"}
    return (
      <div className="App">
        <header className="App-header">
          <h2 style={header}><img src={log_image} alt="rona_busters" style={logoStyle}/>&nbsp;RONA BUSTERS</h2>
        </header> 
        <br/><br/>
        <Container>
          <h5 style={subHeader}>High Touch Area Cleaning</h5>
          <SpacesCards spaces={this.state.spaces} onSpaceCleared={ id => this.spaceCleared(id) } onStartCleaning={ id => this.startCleaning(id)}/>
        </Container>
      </div>
    );
  }
}

export default App;
