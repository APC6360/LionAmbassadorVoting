import React from 'react'
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Image from 'next/image'
import { positions } from '../../components/Dashboard/candidatesData'; 



export default function CandidatesPage() {
  return (
    <PageContainer>
      <Navbar />
      <HeaderTitle>Candidates</HeaderTitle>
      {positions.map((section, index) => (
        <PositionSection key={index} style={{ backgroundColor: section.bg, color: section.color }}>
          <PositionTitle>{section.title}</PositionTitle>
          <CandidatesGrid>
            {section.candidates.map((candidate, idx) => (
              <CandidateCard key={idx}>
                <PlaceholderImage
                  src={`/photos/candidates/${candidate.photo}`}
                  alt={candidate.name}
                  width={180}
                  height={180}
                />
                <CandidateName>{candidate.name}</CandidateName>
                <CandidateRole>{candidate.committee} Committee</CandidateRole>
              </CandidateCard>
            ))}
          </CandidatesGrid>
        </PositionSection>
      ))}
    </PageContainer>
  )
}

const PageContainer = styled.div`
  font-family: 'Gill Sans MT', sans-serif;
`;

const HeaderTitle = styled.h1`
  text-align: center;
  font-size: 48px;
  margin: 30px 0;
`;

const PositionSection = styled.section`
  padding: 60px 20px;
`;

const PositionTitle = styled.h2`
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
`;

const CandidatesGrid = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  justify-items: center;
`;

const CandidateCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaceholderImage = styled(Image)`
  border-radius: 12px;
  object-fit: cover;
`;

const CandidateName = styled.h4`
  margin-top: 16px;
  font-size: 20px;
`;

const CandidateRole = styled.p`
  font-size: 16px;
  margin-top: 4px;
  text-align: center;
`;
