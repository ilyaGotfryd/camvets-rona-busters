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
      this._cleaning_events[space_id] = {time: new Date(demo_now().getTime() - 60*60*1000)}
    }
    return this._cleaning_events[space_id]
  }

  addSpaceCleanedEvent(space_id){
    this._cleaning_events[space_id] = {time: new Date(demo_now() - 1000) }
  }

  fetchEntrCounts(space){
      let last_cleaned_event = this.getLatestSpaceCleanedEvent(space.id)
      console.log(space, last_cleaned_event)
      counts(space.id, last_cleaned_event.time.toISOString(), demo_now().toISOString())
      .then(
        counts_resp => {
          let count = 0
          counts_resp.data.results.forEach(result=> count += result.interval.analytics.entrances)
          let _spaces = this.state.spaces.filter(value => value.id !== space.id )
          _spaces = [..._spaces, {id: space.id, name: space.name, count: count}]
          _spaces.sort((a, b) => (a.count > b.count) ? -1 : 1)
          this.setState({spaces: _spaces})
        }
      )
  }

  fetchEntrCountsInSpaces(){
    spaces()
    .then(resp => {
        resp.data.results.forEach(space => { this.fetchEntrCounts(space)});
    });
  }

  componentDidMount(){
    this.fetchEntrCountsInSpaces();
    let _this = this;
    setInterval(function(){
      _this.fetchEntrCountsInSpaces()
    }, 60*1000)
  }

  spaceCleared( space_id ){
    this.addSpaceCleanedEvent(space_id);
    let _space = {}
    this.state.spaces.forEach(space => _space = (space.id === space_id)?space:_space )
    this.fetchEntrCounts(_space);
  }

  render(){
    return (
      <div className="App">
        <br/>
        <Container>
          <SpacesCards spaces={this.state.spaces} onSpaceCleared={ id => this.spaceCleared(id) }/>
        </Container>
      </div>
    );
  }
}

export default App;
