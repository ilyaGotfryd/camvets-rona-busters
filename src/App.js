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
  }

  getLatestSpaceCleanedEvent(space_id){
    // if there is no event add one that was an hour ago
    // else return one for this space
    return {time: new Date(demo_now().getTime() - 60*60*1000)}
  }

  fetchEntrCountsInSpaces(){
    spaces()
    .then(resp => {
        resp.data.results.forEach(space => {
          let last_cleaned_event = this.getLatestSpaceCleanedEvent(space.id)
          counts(space.id, last_cleaned_event.time.toISOString(), demo_now().toISOString())
          .then(
            counts_resp => {
              let count = 0
              counts_resp.data.results.forEach(result=> count += result.interval.analytics.entrances)
              let _spaces = [...this.state.spaces, {id: space.id, name: space.name, count: count}]
              _spaces.sort((a, b) => (a.count > b.count) ? -1 : 1)
              this.setState({spaces: _spaces})
            }
          )
        });
    });
  }

  componentDidMount(){
    this.fetchEntrCountsInSpaces();
    let _this = this;
    setInterval(function(){
      _this.fetchEntrCountsInSpaces()
    }, 30*1000)
    
  }
  render(){
    return (
      <div className="App">
        
        <Container>
          <SpacesCards spaces={this.state.spaces} />
        </Container>
      </div>
    );
  }
}

export default App;
