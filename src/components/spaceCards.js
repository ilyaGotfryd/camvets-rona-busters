import React, {Component} from 'react';
import {Accordion, Card, Button, } from 'react-bootstrap';

class SpaceCards extends Component{
    render()
    {
        const { spaces } = this.props;
        return (
        <Accordion defaultActiveKey="0">
            {
                spaces.map( (space, i) => (
                    <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey={i}>
                        {space.name}
                      </Accordion.Toggle> <Card.Text>Entrances: {space.count}</Card.Text>
                    </Card.Header>
                    <Accordion.Collapse eventKey={i}>
                        <Card.Body>
                          Hello! I'm the body with id {space.id}
                          <Button variant="success">Area Cleard</Button>
                        </Card.Body>
                    </Accordion.Collapse>
                    </Card>
                ))
            }
      </Accordion>)
    }
};

export default SpaceCards