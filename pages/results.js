
import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import Image from 'next/image';
import VotingContractInterface from '../context/VotingContractInterface';
import { useWallet } from '../context/WalletContext';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voterCount, setVoterCount] = useState(0);
  const { account, isConnected, connectWallet } = useWallet();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        
     
        const initialized = await VotingContractInterface.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize contract');
        }
        
       
        const positionsData = await VotingContractInterface.getAllPositionsWithCandidates();
        setResults(positionsData);
        
       
        try {
          const count = await VotingContractInterface.contract.voterCount();
          setVoterCount(count.toNumber());
        } catch (countError) {
          console.error('Error getting voter count:', countError);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(`Failed to load results: ${err.message}`);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <PageContainer>
      <Navbar />
      <ContentContainer>
        <Header>
          <Title>Voting Results</Title>
          <Subtitle>
            See the current voting results for each position.
            {voterCount > 0 && <VoterCount>Total Voters: {voterCount}</VoterCount>}
          </Subtitle>
          
          {!isConnected && (
            <ConnectWalletButton onClick={connectWallet}>
              Connect Wallet to View Results
            </ConnectWalletButton>
          )}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Header>

        {loading ? (
          <LoadingContainer>
            <LoadingText>Loading results...</LoadingText>
          </LoadingContainer>
        ) : (
          <ResultsContainer>
            {results.map((position, index) => (
              <PositionSection key={index}>
                <PositionTitle>{position.title}</PositionTitle>
                <CandidatesGrid>
                  {position.candidates.map((candidate, idx) => {
                 
                    const totalVotes = position.candidates.reduce(
                      (sum, c) => sum + c.voteCount, 0
                    );
                    const percentage = totalVotes > 0 
                      ? Math.round((candidate.voteCount / totalVotes) * 100) 
                      : 0;
                    
                    return (
                      <CandidateCard key={idx}>
                        <ImageWrapper>
                          <StyledImage
                            src={`/photos/candidates/${candidate.photoUrl}`}
                            alt={candidate.name}
                            width={120}
                            height={120}
                          />
                        </ImageWrapper>
                        <CandidateInfo>
                          <CandidateName>{candidate.name}</CandidateName>
                          <Committee>{candidate.committee} Committee</Committee>
                          <VoteInfo>
                            <VoteCount>{candidate.voteCount} votes</VoteCount>
                            <VotePercentage>({percentage}%)</VotePercentage>
                          </VoteInfo>
                          <ProgressBar>
                            <Progress percentage={percentage} />
                          </ProgressBar>
                        </CandidateInfo>
                      </CandidateCard>
                    );
                  })}
                </CandidatesGrid>
              </PositionSection>
            ))}
          </ResultsContainer>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  background-color: #0A1B3F;
  color: #ffffff;
  font-family: 'Gill Sans MT', sans-serif;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 60px;
`;

const Header = styled.div`
  text-align: center;
  padding: 30px 0;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #cdd5e0;
  margin-bottom: 20px;
`;

const VoterCount = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #a0aec0;
`;

const ConnectWalletButton = styled.button`
  background-color: #cdd5e0;
  color: #0A1B3F;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background-color: #ffffff;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.div`
  font-size: 20px;
  color: #cdd5e0;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const PositionSection = styled.div`
  background-color: #1e2a47;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const PositionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
  color: #ffffff;
  border-bottom: 2px solid #cdd5e0;
  padding-bottom: 12px;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const CandidateCard = styled.div`
  background-color: #2c3e5a;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 2px solid #cdd5e0;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CandidateInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const CandidateName = styled.h3`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 6px;
`;

const Committee = styled.p`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 15px;
`;

const VoteInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const VoteCount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;

const VotePercentage = styled.span`
  font-size: 14px;
  color: #a0aec0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #1e2a47;
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #cdd5e0;
  width: ${props => props.percentage}%;
  transition: width 0.5s ease;
`;