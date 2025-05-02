//this is the admin page for the voting contract, where the admin can add positions and candidates

import Navbar from '@/components/Dashboard/Navbar';
import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { useWallet } from '../context/WalletContext';
import VotingContractInterface from '../context/VotingContractInterface';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [positions, setPositions] = useState([]);
  const { account, isConnected, connectWallet } = useWallet();

  useEffect(() => {
    const checkAdmin = async () => {
      if (isConnected && account) {
        try {
          await VotingContractInterface.ensureInitialized();
          
          const admin = await VotingContractInterface.contract.admin();
          const isCurrentUserAdmin = admin.toLowerCase() === account.toLowerCase();
          
          setIsAdmin(isCurrentUserAdmin);
          
          if (!isCurrentUserAdmin) {
            setMessage('You are not the admin of this contract');
          } else {
           
            const contractPositions = await VotingContractInterface.getAllContractPositions();
            setPositions(contractPositions);
          }
        } catch (error) {
          console.error('Error checking admin:', error);
          setMessage(`Error: ${error.message}`);
        }
      }
    };
    
    checkAdmin();
  }, [isConnected, account]);

  const handleAddPositions = async () => {
    try {
      setMessage('Adding positions...');
      const result = await VotingContractInterface.addPositions();
      
      if (result) {
        setMessage('Positions added successfully');
        
        const contractPositions = await VotingContractInterface.getAllContractPositions();
        setPositions(contractPositions);
      } else {
        setMessage('Failed to add positions');
      }
    } catch (error) {
      console.error('Error adding positions:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleAddCandidates = async () => {
    try {
      setMessage('Adding candidates...');
      const result = await VotingContractInterface.addCandidates();
      
      if (result) {
        setMessage('Candidates added successfully');
      } else {
        setMessage('Failed to add candidates');
      }
    } catch (error) {
      console.error('Error adding candidates:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Container>
      
      <Title>Voting Contract Admin</Title>
      <Navbar />
      
      {!isConnected ? (
        <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
      ) : !isAdmin ? (
        <Message>{message}</Message>
      ) : (
        <>
        
          <StatusSection>
            <h2>Contract Status</h2>
            <p>Connected as: {account}</p>
            <p>Admin status: {isAdmin ? 'You are the admin' : 'Not admin'}</p>
            <p>Positions: {positions.length}</p>
          </StatusSection>
          
          <ActionSection>
            <h2>Admin Actions</h2>
            <Button onClick={handleAddPositions}>Add Positions</Button>
            <Button onClick={handleAddCandidates}>Add Candidates</Button>
          </ActionSection>
          
          {message && <Message>{message}</Message>}
          
          <PositionSection>
            <h2>Current Positions</h2>
            {positions.length === 0 ? (
              <p>No positions found in the contract</p>
            ) : (
              <ul>
                {positions.map((position, index) => (
                  <li key={index}>
                    Position {index}: {position.title} (Max votes: {position.maxVotes})
                  </li>
                ))}
              </ul>
            )}
          </PositionSection>
        </>
      )}
    </Container>
  );
}


const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Gill Sans MT', sans-serif;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 24px;
`;

const ConnectButton = styled.button`
  padding: 12px 24px;
  background-color: #0A1B3F;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #152a54;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #0A1B3F;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #152a54;
  }
`;

const Message = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: ${props => props.isError ? '#ffeeee' : '#eeffee'};
  border: 1px solid ${props => props.isError ? '#ffcccc' : '#ccffcc'};
  border-radius: 4px;
`;

const StatusSection = styled.div`
  margin-bottom: 30px;
`;

const ActionSection = styled.div`
  margin-bottom: 30px;
`;

const PositionSection = styled.div`
  margin-bottom: 30px;
`;