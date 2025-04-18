// This will be the layout for the new Candidates page using alternating background colors
import React from 'react'
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Image from 'next/image'

const positions = [
  {
    title: "University Relations Director",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Xavier Claudio", committee: "Walker" },
      { name: "Izzy Ems", committee: "Hetzel" },
      { name: "Fer Garza Martinez", committee: "Walker" }
    ]
  },
  {
    title: "Director of Communications",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Bella Applegate", committee: "Hetzel" },
      { name: "India Deck", committee: "Walker" },
      { name: "Sarah Grosch", committee: "Hetzel" }
    ]
  },
  {
    title: "Secretary",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Alexys Alonzo", committee: "Hetzel" },
      { name: "Avery Needham", committee: "Walker" },
      { name: "Grace Rothenberg", committee: "Hetzel" }
    ]
  },
  {
    title: "2kOld Committee Directors",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Katie Buck", committee: "Walker" },
      { name: "Dylan Coulter", committee: "Walker" },
      { name: "Izzy Ems", committee: "Hetzel" },
      { name: "Sarah Grosch", committee: "Hetzel" },
      { name: "Andrew Sheehan", committee: "Walker" }
    ]
  },
  {
    title: "2kNew Committee Directors",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Bella Applegate", committee: "Hetzel" },
      { name: "Cece Gonzales", committee: "Walker" },
      { name: "Quinn Johnson", committee: "Walker" },
      { name: "Ryan Kiyak", committee: "Hetzel" },
      { name: "Antonio Marcucci", committee: "Walker" },
      { name: "Nicole Orbe-Munoz", committee: "Hetzel" }
    ]
  },
  {
    title: "Director of Internal Affairs",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Xavier Claudio", committee: "Walker" },
      { name: "India Deck", committee: "Walker" },
      { name: "Nicole Orbe-Munoz", committee: "Hetzel" }
    ]
  },
  {
    title: "Tour Director",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Amanda Kulak", committee: "Hetzel" },
      { name: "Isabella Tramontin", committee: "Walker" },
      { name: "Evan Varlas", committee: "Hetzel" }
    ]
  },
  {
    title: "Chief Information Director",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Jenna Fadel", committee: "Walker" },
      { name: "Shane Marchok", committee: "Hetzel" }
    ]
  },
]

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
                <PlaceholderImage src="/photos/placeholder.png" alt={candidate.name} width={180} height={180} />
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
