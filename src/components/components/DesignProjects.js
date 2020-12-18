import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import SmashComputer from '../../project-images/smash-computer.svg'
import WebDrumKit from '../../project-images/web-drum-kit.svg'
import Pikamovie from '../../project-images/pikamovie.svg'
import Sandcamp from '../../project-images/sandcamp.svg'
import Airmap from '../../project-images/Airapp.svg'
import RpiDrumKit from '../../project-images/circle.svg'

const Wrapper = styled.div`
  display: flex;
`;

export default class Project extends React.Component {

  render() {
    return (
      <div className="project-container">
        {/* <Row>
          <Col className="code-project hvr-float-shadow shine">
            <div className="project-header">
              <h5>UI/UX</h5>
            </div>
            <div className="project-description">
              <p></p>
            </div>    
          </Col>
					<Col className="code-project hvr-float-shadow shine">
            <div className="project-header">
              <h5>Comics</h5>
              <div>
                <Button href="https://imstuck.netlify.app/" target="_blank"><i class="fab fa-instagram"></i>Instagram</Button>
              </div>
            </div>
            <div className="project-description">
              <p></p>
            </div>    
          </Col>
        </Row>
				<Row>
          <Col className="code-project hvr-float-shadow shine">
            <div className="project-header">
              <h5>Graphic Design</h5>
            </div>
            <div className="project-description">
              <p></p>
            </div>    
          </Col>
					<Col className="code-project hvr-float-shadow shine">
            <div className="project-header">
              <h5>Mixed Media</h5>
              <div>
              </div>
            </div>
            <div className="project-description">
              <p></p>
            </div>    
          </Col>
        </Row> */}
      </div>
    );
  }
}