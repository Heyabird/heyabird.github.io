import React from 'react';
import styled from 'styled-components';
import DesignProjects from '../components/DesignProjects';
import { Button } from 'reactstrap';


export const Design = () => (
  <>
    <div className="page-header">
        <h1>Art & Design</h1>
    </div>
    <div className="page-content">
        <h4>Page Under Construction!</h4><h4>
          For now, see my comics on: <Button href="https://instagram.com/heya.comics" target="_blank"><i class="fab fa-instagram"></i>Instagram</Button></h4>
      <div id="heya-cartoon">
        <img src="/heya_construction_outside.svg" onMouseOver={e => (e.currentTarget.src = "/heya_construction_inside.svg")} onMouseOut={e => (e.currentTarget.src = "/heya_construction_outside.svg")}/>
      </div>
    </div>
      {/* <div class="filter"><Button>Filter</Button></div> */}
    <DesignProjects/>
  </>
)