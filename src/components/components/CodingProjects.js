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
      <div class="project-container">
        <Row>
          <Col className="code-project hvr-float-shadow shine" id="smash-computer">
            <div className="project-header">
              <h5>Smash Computer</h5>
              <div>
                <Button href="https://imstuck.netlify.app/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button>
                <Button href="https://github.com/heyabird/anger-release-app" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div>
            <div className="project-description">
              <img src={SmashComputer}/>
              <p>Stuck? Angry? Stressed? Smash your virtual computer for days on this app.</p>
            </div>    
            <div className="btn-container">
              {/* <Button color="secondary">Front-end</Button> */}
              <Button color="success">Javascript</Button>
              <Button color="success">CSS</Button> 
            </div>
          </Col>
          <Col className="code-project hvr-float-shadow" id="web-drum-kit">
          <div className="project-header">
              <h5>Web Drum Kit</h5>
              <div>
                <Button href="https://heyadrums.netlify.app/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button>
                <Button href="https://github.com/Heyabird/heya_drum_kit" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div>    
            <div className="project-description">
              <img src={WebDrumKit}/>
              <p>Play drums on this fun, animated web drum kit using my samples.</p>
            </div>         
            <div className="btn-container">
              {/* <Button color="secondary">Front-end</Button> */}
              <Button color="success">Javascript</Button>
              <Button color="success">CSS</Button> 
            </div>
          </Col>
          <Col className="code-project hvr-float-shadow">
            <div className="project-header">
              <h5>PikaMovie</h5>
              <div>
                <Button href="https://pikamovie.herokuapp.com/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button>
                <Button href="https://github.com/TheJonasSisters/pikachoose_app" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div> 
            <div className="project-description">
              <img src={Pikamovie}/>
              <p>This CRUD app picks a movie for you. You can also log in to store movies and comments.</p>
            </div> 
            <div className="btn-container">
              {/* <Button color="secondary">Full-Stack</Button> */}
              <Button color="success">React</Button>
              <Button color="success">SCSS</Button> 
              <Button color="danger">Rails</Button> 
              <Button color="warning">Postgres</Button> 
              <Button color="primary">TMDB</Button> 
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="code-project hvr-float-shadow">
          <div className="project-header">
              <h5>Sandcamp</h5>
              <div>
                {/* <Button href="https://pikamovie.herokuapp.com/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button> */}
                <Button href="https://github.com/Heyabird/Sandcamp_v2" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div>    
            <div className="project-description">
              <img src={Sandcamp}/>
              <p>Discover hidden gems of the music world. Work in progress.</p>
            </div>            
            <div className="btn-container">
              {/* <Button color="secondary">Full-Stack</Button> */}
              <Button color="success">Javascript</Button>
              <Button color="success">SCSS</Button> 
              <Button color="danger">Rails</Button>
              <Button color="warning">MySQL</Button> 
              <Button color="primary">Spotify</Button> 
            </div>
          </Col>
          <Col className="code-project hvr-float-shadow">
          <div className="project-header">
              <h5>Air Map</h5>
              <div>
                {/* <Button href="https://pikamovie.herokuapp.com/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button> */}
                <Button href="https://github.com/Heyabird/air_pollution_map_VERSION2" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div>   
            <div className="project-description">
              <img src={Airmap}/>
              <p>A responsive data viz app that shows air pollution in major cities.</p>
              <div className="btn-container">
              <Button color="success">React</Button>
              <Button color="success">CSS</Button>
              <Button color="danger">Python</Button>
              <Button color="primary">Mapbox</Button>
            </div>
            </div>                 

          </Col>   
          <Col className="code-project hvr-float-shadow">
          <div className="project-header">
              <h5>RPi Drum Kit</h5>
              <div>
                {/* <Button href="https://pikamovie.herokuapp.com/" target="_blank"><i class="fas fa-desktop"></i> Demo</Button> */}
                <Button href="https://github.com/Heyabird/RaspberryPi-Drumkit" target="_blank"><i class="fab fa-github-alt"></i> Repo</Button>
              </div>
            </div>
            <div className="project-description">
              <img src={RpiDrumKit}/>
              <p>A drum kit built with RaspberryPi and arcade buttons. Work in progress.</p>
            </div>  
            <div className="btn-container">
              <Button color="danger">C++</Button> 
              <Button color="danger">Python</Button>
            </div>
          </Col>   
        </Row>
      </div>
    );
  }
}