import React, { useState } from 'react';
import { styled } from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import Image from 'next/image';
import { positions } from '../../components/Dashboard/candidatesData'; 

export default function VotingPage() {
  const [votes, setVotes] = useState({});

  const handleVote = (position, candidate) => {
    const maxVotes = position.includes('2kOld') || position.includes('2kNew') ? 3 : 1;
    const currentVotes = votes[position] || [];

    const isSelected = currentVotes.includes(candidate);
    let updatedVotes;

    if (isSelected) {
      updatedVotes = currentVotes.filter(name => name !== candidate);
    } else {
      if (currentVotes.length < maxVotes) {
        updatedVotes = [...currentVotes, candidate];
      } else {
        updatedVotes = [candidate];
      }
    }

    setVotes({ ...votes, [position]: updatedVotes });
  };

  const isSelected = (position, candidate) => {
    return (votes[position] || []).includes(candidate);
  };

  const handleSubmit = () => {
    console.log('Submitted votes:', votes);
    alert('Votes submitted!');
  };

  return (
    <PageContainer>
      <Navbar />
      <VotingHeader>
        <PageTitle>Cast Your Vote</PageTitle>
        <PageSubtitle>
          Vote for <strong>1</strong> candidate per position.<br />
          For <strong>2kOld</strong> and <strong>2kNew</strong>, vote for up to <strong>3</strong>.
        </PageSubtitle>
      </VotingHeader>

      {positions.map((section, index) => (
        <PositionContainer key={index}>
          <PositionTitle>{section.title}</PositionTitle>
          <CardRow>
            {section.candidates.map((candidate, idx) => (
              <Card key={idx} selected={isSelected(section.title, candidate.name)}>
                <ImageWrapper>
                  <StyledImage
                    src={`/photos/candidates/${candidate.photo}`}
                    alt={candidate.name}
                    width={150}
                    height={150}
                  />
                </ImageWrapper>
                <Info>
                  <Name>{candidate.name}</Name>
                  <Committee>{candidate.committee} Committee</Committee>
                  <VoteButton
                    onClick={() => handleVote(section.title, candidate.name)}
                    selected={isSelected(section.title, candidate.name)}
                  >
                    {isSelected(section.title, candidate.name) ? 'Selected' : 'Select'}
                  </VoteButton>
                </Info>
              </Card>
            ))}
          </CardRow>
        </PositionContainer>
      ))}

      <SummarySection>
        <SummaryTitle>Your Selections</SummaryTitle>
        <ul>
          {Object.entries(votes).map(([position, candidates]) => (
            <li key={position}>
              <strong>{position}:</strong> {candidates.join(', ') || 'No selection'}
            </li>
          ))}
        </ul>
        <SubmitButton onClick={handleSubmit}>Submit Vote</SubmitButton>
      </SummarySection>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  background-color: #0A1B3F;
  color: #ffffff;
  font-family: 'Gill Sans MT', sans-serif;
  padding-bottom: 60px;
`;

const VotingHeader = styled.div`
  text-align: center;
  padding: 60px 20px 30px;
  background-color: #071a33;
`;

const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #cdd5e0;
`;

const PositionContainer = styled.div`
  margin-top: 50px;
  padding: 0 30px;
`;

const PositionTitle = styled.h2`
  font-size: 26px;
  margin-bottom: 20px;
  color: #cdd5e0;
  border-bottom: 2px solid #cdd5e0;
  padding-bottom: 8px;
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: ${({ selected }) => (selected ? '#2c3e5a' : '#1e2a47')};
  border-radius: 12px;
  text-align: center;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.2s ease-in-out;
`;

const ImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
  border: 2px solid #cdd5e0;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  text-align: center;
`;

const Name = styled.h3`
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 6px;
`;

const Committee = styled.p`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 10px;
`;

const VoteButton = styled.button`
  background-color: ${({ selected }) => (selected ? '#ffffff' : '#cdd5e0')};
  color: ${({ selected }) => (selected ? '#0A1B3F' : '#0A1B3F')};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: #ffffff;
    color: #0A1B3F;
  }
`;

const SummarySection = styled.div`
  margin: 60px auto;
  max-width: 700px;
  padding: 30px;
  background-color: #1e2a47;
  border-radius: 12px;
`;

const SummaryTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffffff;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: #cdd5e0;
  color: #0A1B3F;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #ffffff;
    color: #0A1B3F;
  }
`;