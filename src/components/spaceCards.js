import React, {Component} from 'react';
import {Accordion, Card, Button, } from 'react-bootstrap';
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
        return (
        <Accordion defaultActiveKey="0">
            {
                spaces.map( (space, i) => (
                    <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant={(space.count<=20)?"info":(space.count<=50)?"warning":"danger"} eventKey={i}>
                        {space.name}
                      </Accordion.Toggle> <Card.Text>Visits: {space.count}</Card.Text>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                          <Button 
                            variant={(space.cleaningInProgress)?"light":"primary"}
                            disabled={space.cleaningInProgress}
                            onClick={()=>onStartCleaning(space.id)}>
                              {(space.cleaningInProgress)?this.cleaningDuration(space.start_time):"Start Cleaning"}
                            </Button>&nbsp;
                            <Button variant="success" areaId={space.id} onClick={()=> onSpaceCleared(space.id)} >Cleaned</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                    </Card>
                ))
            }
      </Accordion>)
    }
};

export default SpaceCards