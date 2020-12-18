import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import { Button } from 'reactstrap';
import styled from 'styled-components';

const mobile_breakpoint = 900;
const xl_breakpoint = 1700;

const Styles = styled.div`
  .navbar {
    position: absolute;
    bottom: -50px;
    z-index: 1;
    right: 5%;
    // width: 50%;
  }
  a, .navbar-nav, .navbar-light .nav-link {
    color: black;
    transition: color .5s;
    &:hover { color: #007BFF; }
  }
  .navbar-brand {
    font-size: 1.4em;
    color: black;
    &:hover { color: #007BFF; }
  }
  .form-center {
    position: absolute !important;
    left: 25%;
    right: 25%;
  }
  .fab {
    margin: 10px;
  }
  @media (max-width: ${mobile_breakpoint}px) {
    .navbar { 
      position: fixed;
      bottom: 0;
      right: 0;
      background-color: white;
      width: 100%;
    }
    a {
      background-color: white; 
      border-radius: 50px;
      height: 50px;
    }
  }
`;
export const Contact = () => (
  <Styles>
    <Navbar expand="lg">
      {/* <p>Contact Me</p> */}
      <a href="https://twitter.com/heyathebird/" target="_blank"><i class="fab fa-twitter fa-3x"></i></a>
      <a href="https://www.linkedin.com/in/heya/" target="_blank" class=""><i class="fab fa-linkedin fa-3x "></i></a>
      <a href="https://github.com/Heyabird" target="_blank"><i class="fab fa-github-alt fa-3x"></i></a>
      <a href="mailto:heyabird@gmail.com" target="_blank" class=""><i id="email-icon" class="far fa-envelope fa-3x"></i></a>
    </Navbar>
  </Styles>
)