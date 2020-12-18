import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`

`;

function hover(element) {
  element.setAttribute('src', '/heya_inside.svg');
  console.log("hover!")
}

export const Home = (props) => (
  <>
    <div className="page-header">
      <div>
        <h1>Heya, World!</h1>
      </div>
    </div>
    <div class="page-content">
      <h4>I'm Heya. I like to code, design, and make music.</h4>
      <h4 class="desktop-only">Hover over me to see what's inside me.</h4>
      <h4 class="mobile-only">Click on me to see what's inside me.</h4>
      <div id="heya-cartoon">
        <img src="/heya_outside.svg" onMouseOver={e => (e.currentTarget.src = "/heya_inside.svg")} onMouseOut={e => (e.currentTarget.src = "/heya_outside.svg")}/>
      </div>
    </div> 
  </>
)