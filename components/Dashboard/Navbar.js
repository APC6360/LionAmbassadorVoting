import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'
import { useRouter } from 'next/router'

const Navbar = () => {
  

  return (
    <Nav>
      <LeftSide>
        <LAMBS href="/">Lion Ambassadors</LAMBS>
      </LeftSide>
      <NavLinks>
        <StyledButton href='/candidates/Candidates'>Candidates</StyledButton>
        <StyledButton href="/candidates/CandidatesVotes">Vote Now!</StyledButton>
      </NavLinks>
    </Nav>
  );
};

const LeftSide = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`

const LAMBS = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  font-family: 'Gill Sans MT';
  background: linear-gradient(90deg, #ffffff 0%,rgb(10, 55, 255) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  

  
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #071530;
  color: white;
  font-family: 'Gill Sans MT';
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledButton = styled(Link)`
  color: #0A1B3F;
  background-color: #ffffff;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Gill Sans MT';
  &:hover {
    transition: 0.3s;
    background-color:rgb(45, 112, 179);
    color:rgb(255, 255, 255);
    
  }
`;



export default Navbar;
