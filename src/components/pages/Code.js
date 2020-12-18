import React from 'react';
import CodingProjects from '../components/CodingProjects';
import { Button } from 'reactstrap';

export const Code = () => (
  <>
    <div className="page-header">
        <h1>Coding Projects</h1>
        {/* <p id="code-page-description">Click on <Button><i class="fas fa-desktop"></i> Try</Button> to see the project deployed and <Button><i class="fab fa-github-alt"></i> Repo</Button> to go to the Github repository. The colored tags show the stack I used.</p> */}
        <p id="tag-description">
          {/* The tags on the bottom show what stack I mainly used and are color-coded: <Button color="success">Frontend</Button><Button color="danger">Backend</Button><Button color="warning">Database</Button><Button color="primary">External API</Button> */}
        </p>
        <br/>
      </div>
      {/* <div class="filter"><Button>Filter</Button></div> */}
    <CodingProjects/>
  </>
)