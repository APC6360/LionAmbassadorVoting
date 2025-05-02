import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import { useWallet } from '@/context/WalletContext';
import Home from '@/components/Dashboard/Home';
import { useRouter } from 'next/router';

const Navbar = () => {
  // Get wallet context safely with default values
  const walletContext = useWallet();
  
  // Safely destructure values with fallbacks
  const account = walletContext?.account || '';
  const isConnected = walletContext?.isConnected || false;
  const connectWallet = walletContext?.connectWallet || (() => {});
  const disconnectWallet = walletContext?.disconnectWallet || (() => {});
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get button text based on connection status
  const getButtonText = () => {
    return isConnected ? formatAddress(account) : 'Connect Wallet';
  };

  // Handle wallet button click with error catching
  const handleWalletClick = async () => {
    try {
      if (isConnected) {
        disconnectWallet();
      } else {
        // Check if MetaMask is installed
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

  return (
    <Nav>
      <LeftSide>
        <LAMBS href="/">Lion Ambassadors</LAMBS>
      </LeftSide>
      <NavLinks>
        <StyledButton href='/candidates/Candidates'>Candidates</StyledButton>
        <StyledButton href="/candidates/CandidatesVotes">Vote Now!</StyledButton>
        <WalletButton 
          onClick={handleWalletClick}
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
`;

export default Navbar;