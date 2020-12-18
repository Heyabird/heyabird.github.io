import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { StyledNavItem } from './StyledNavItem';
import styled from "styled-components";
// import heya from '../../icons/heya.svg';


export default class NavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heya: 'heya',
    }
  }

  handleClick = () => {
    const { path, onItemClick } = this.props;
    onItemClick(path);
  }

  render() {
    const { active } = this.props;
    const NavIcon = styled.div`x`;
    return (
      <StyledNavItem active={active} >
        <Link to={this.props.path} onClick={this.handleClick}>
          <img className="" src={this.props.imagePath} alt="icon"/>
          <p class="nav-text">{this.props.name}</p>
        </Link>
    </StyledNavItem>
    );
  }
}
