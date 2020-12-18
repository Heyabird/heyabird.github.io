import styled from "styled-components";
/* This defines the actual bar going down the screen */

const mobile_breakpoint = 900;
const xl_breakpoint = 1700;

export const StyledSideNav = styled.div`
  position: absolute;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  // height: 80%;
  // width: 100px;     /* Set the width of the sidebar */
  z-index: 2;      
  top: .2rem;      /* Stay at the top */
  background-color: white; 
  color: white;
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 2%;
  left: -120px;

  @media (max-width: ${mobile_breakpoint}px) {
    position: relative;
    // width: inherit;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    left: 0;
  }

  @media (min-width: ${xl_breakpoint}px) {
    left: -150px;
    top: 1rem;      /* Stay at the top */
  }
`;

