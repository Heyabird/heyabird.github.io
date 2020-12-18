import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Contact } from './components/components/Contact';
import { Home } from './components/pages/Home';
import { Code } from './components/pages/Code';
import { Design } from './components/pages/Design';
import { Music } from './components/pages/Music';
import { NoMatch } from './components/pages/NoMatch';
import Sidebar from './components/components/Sidebar';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'

const mobile_breakpoint = 900;
const xl_breakpoint = 1700;

const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    @media (min-width: ${xl_breakpoint}px) {
      margin-left: 8%;
      // display: flex;
      // justify-content: center;
    }
  }
`

const Everything = styled.div`
  background-color: red;
`

const Wrapper = styled.div`
  margin: 3rem 4rem 2.5rem 9.5rem;
  height: 82%;
  border: 1px solid black;
  border-radius: 10px;
  width: 85%;
  max-width: 1300px;
  max-height: 700px;
  padding: 2rem;
  position: absolute;
  // overflow: scroll;
  // background-color: #E7E7E7;
  z-index: 2;

  @media (max-width: ${mobile_breakpoint}px) {
    padding: 0 1.5rem 1rem 1.5rem;
    margin: 0 1rem .5rem 1rem;
    max-width: 100%;
    height: inherit;
    min-height: 90%;
    min-width: 100%;
    border: none;
    border-radius: 0;
    width: inherit;
    margin: 0 auto;
  }

  @media (min-width: ${xl_breakpoint}px) {
    margin-top: 6%;
  }
`;

function App() {
  return (
    <>
    <GlobalStyle/>
    <Router>
      {/* <Everything> */}
        <Wrapper>
        <Sidebar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/code" component={Code} />
            <Route path="/design" component={Design} />
            <Route path="/music" component={Music} />            
            <Route component={NoMatch} />
          </Switch>
          <Contact />
        </Wrapper>
      {/* </Everything> */}
    </Router>
    </>
  );
}

export default App;
