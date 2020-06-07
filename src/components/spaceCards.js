import React, {Component} from 'react';
import {Card, Button, Badge} from 'react-bootstrap';
import { demo_now } from '../services/demoTimeService';

class SpaceCards extends Component{
    cleaningDuration(start_time){
      let diff = demo_now().getTime() - start_time.getTime();
      let hours = Math.floor(diff / (60*60*1000))
      let hours_str = hours.toString().padStart(2, "0")
      let min = Math.floor((diff%(60*60*1000))/(60*1000))
      let min_str = min.toString().padStart(2, "0")
      let sec = Math.floor((diff%(60*1000))/1000)
      let sec_str = sec.toString().padStart(2, "0")
      return `${hours_str}:${min_str}:${sec_str}`
    }
    render()
    {
      const { spaces, onSpaceCleared, onStartCleaning } = this.props;
      let decrptext = {color:"#616161", fontSize:"16px", marginBottom:"0px"}
      return (
              spaces.map( (space, i) => ( 
                  <Card>
                    <Card.Body>
                      <Card.Title> 
                        <span style={{fontSize:"1.4rem"}}>{space.name}&nbsp;</span>
                          <Badge variant={(space.count<=20)?"success":(space.count<=50)?"warning":"danger"}>
                            {(space.count<=20)?"Safe":(space.count<=50)?"Warning":"Urgent"}
                          </Badge>  
                      </Card.Title>
                      <Card.Text>
                        <p style={decrptext}>Visits: {space.count}&nbsp;</p>
                        {
                          (space.cleaningInProgress)?
                          (<p style={decrptext}>Cleaning space for: { this.cleaningDuration(space.start_time)}</p>):
                          (<Button 
                            variant={(space.cleaningInProgress)?"outline-light":"outline-primary"}
                            disabled={space.cleaningInProgress}
                            onClick={()=>onStartCleaning(space.id)}>
                              {(space.cleaningInProgress)?this.cleaningDuration(space.start_time):"Start Cleaning"}
                            </Button>)
                        }
                          &nbsp;
                          <Button variant="outline-success" areaId={space.id} onClick={()=> onSpaceCleared(space.id)} >Cleaned</Button>
                        </Card.Text>
                    </Card.Body>
                  </Card>
              ))
      )}
};

export default SpaceCards