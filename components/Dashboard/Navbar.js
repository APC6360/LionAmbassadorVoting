import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import { useWallet } from '@/context/WalletContext';
import Home from '@/components/Dashboard/Home';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const walletContext = useWallet();
  
  const account = walletContext?.account || '';
  const isConnected = walletContext?.isConnected || false;
  const connectWallet = walletContext?.connectWallet || (() => {});
  const disconnectWallet = walletContext?.disconnectWallet || (() => {});
  

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  
  const getButtonText = () => {
    return isConnected ? formatAddress(account) : 'Connect Wallet';
  };


  const handleWalletClick = async () => {
    try {
      if (isConnected) {
        disconnectWallet();
      } else {
    
        if (typeof window !== 'undefined' && !window.ethereum) {
          alert('Please install MetaMask to connect your wallet');
          return;
        }
        await connectWallet();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Error connecting wallet. Please make sure MetaMask is installed and try again.');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Nav>
      <LeftSide>
        <LAMBS href="/">Lion Ambassadors</LAMBS>
      </LeftSide>
      
      <HamburgerButton onClick={toggleMenu}>
        <HamburgerIcon open={menuOpen}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerIcon>
      </HamburgerButton>
      
      <NavLinks open={menuOpen}>
        <StyledButton href='/candidates/Candidates' onClick={() => setMenuOpen(false)}>
          Candidates
        </StyledButton>
        <StyledButton href="/candidates/CandidatesVotes" onClick={() => setMenuOpen(false)}>
          Vote Now!
        </StyledButton>
        <StyledButton href="/results" onClick={() => setMenuOpen(false)}>
          Results
        </StyledButton>
        <StyledButton href="/admin" onClick={() => setMenuOpen(false)}>
          Admin
        </StyledButton>
        <WalletButton 
          onClick={() => {
            handleWalletClick();
            setMenuOpen(false);
          }}
          isConnected={isConnected}
        >
          {getButtonText()}
        </WalletButton>
      </NavLinks>
    </Nav>
  );
};

const LeftSide = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 10;
`;

const LAMBS = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  font-family: 'Gill Sans MT';
  background: linear-gradient(90deg, #ffffff 0%,rgb(10, 55, 255) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #071530;
  color: white;
  font-family: 'Gill Sans MT';
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #071530;
    padding: ${props => (props.open ? '1rem 0' : '0')};
    max-height: ${props => (props.open ? '500px' : '0')};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    box-shadow: ${props => (props.open ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none')};
    z-index: 100;
  }
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
  
  @media (max-width: 768px) {
    width: 80%;
    text-align: center;
    margin: 8px 0;
  }
`;

const WalletButton = styled.button`
  color: #0A1B3F;
  background-color: ${props => props.isConnected ? '#a3e635' : '#ffffff'};
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  text-decoration: none;
  font-weight: bold;
  font-family: 'Gill Sans MT';
  cursor: pointer;
  &:hover {
    transition: 0.3s;
    background-color: ${props => props.isConnected ? '#84cc16' : 'rgb(45, 112, 179)'};
    color: ${props => props.isConnected ? '#0A1B3F' : 'rgb(255, 255, 255)'};
  }
  
  @media (max-width: 768px) {
    width: 80%;
    margin: 8px 0;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 10;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const HamburgerIcon = styled.div`
  width: 25px;
  height: 20px;
  position: relative;
  
  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: white;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
    
    &:nth-child(1) {
      top: ${props => (props.open ? '9px' : '0px')};
      transform: ${props => (props.open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    
    &:nth-child(2) {
      top: 9px;
      opacity: ${props => (props.open ? '0' : '1')};
    }
    
    &:nth-child(3) {
      top: ${props => (props.open ? '9px' : '18px')};
      transform: ${props => (props.open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`;

export default Navbar;