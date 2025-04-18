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
      { name: "Xavier Claudio", committee: "Fraser", photo: "xavier-claudio.jpg" },
      { name: "Izzy Ems", committee: "Walker", photo: "izzy-ems.jpg" },
      { name: "Fer Garza Martinez", committee: "Burrowes", photo: "fer-garza-martinez.jpg" }
    ]
  },
  {
    title: "Director of Communications",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Bella Applegate", committee: "Hetzel", photo: "bella-applegate.jpg" },
      { name: "India Deck", committee: "N/A", photo: "india-deck.jpg" },
      { name: "Sarah Grosch", committee: "N/A", photo: "sarah-grosch.jpg" }
    ]
  },
  {
    title: "Secretary",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Alexys Alonzo", committee: "Atherton", photo: "alexys-alonzo.jpg" },
      { name: "Avery Needham", committee: "Walker", photo: "avery-needham.jfif" },
      { name: "Grace Rothenberg", committee: "Walker", photo: "grace-rothenberg.jfif" }
    ]
  },
  {
    title: "2kOld Committee Directors",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Katie Buck", committee: "Atherton", photo: "katie-buck.jpg" },
      { name: "Dylan Coulter", committee: "N/A", photo: "dylan-coulter.jpg" },
      { name: "Izzy Ems", committee: "Walker", photo: "izzy-ems.jpg" },
      { name: "Sarah Grosch", committee: "N/A", photo: "sarah-grosch.jpg" },
      { name: "Andrew Sheehan", committee: "N/A", photo: "andrew-sheehan.jpg" }
    ]
  },
  {
    title: "2kNew Committee Directors",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Bella Applegate", committee: "Hetzel", photo: "bella-applegate.jpg" },
      { name: "Cece Gonzales", committee: "Atherton", photo: "cece-gonzales.jpg" },
      { name: "Quinn Johnson", committee: "Atherton", photo: "quinn-johnson.jpg" },
      { name: "Ryan Kiyak", committee: "Sparks", photo: "ryan-kiyak.jpg" },
      { name: "Antonio Marcucci", committee: "Hetzel", photo: "antonio-marcucci.jpg" },
      { name: "Nicole Orbe-Munoz", committee: "Burrowes", photo: "nicole-orbe-munoz.jpg" }
    ]
  },
  {
    title: "Director of Internal Affairs",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Xavier Claudio", committee: "Fraser", photo: "xavier-claudio.jpg" },
      { name: "India Deck", committee: "N/A", photo: "india-deck.jpg" },
      { name: "Nicole Orbe-Munoz", committee: "Burrowes", photo: "nicole-orbe-munoz.jpg" }
    ]
  },
  {
    title: "Tour Director",
    bg: "#0A1B3F",
    color: "#FFFFFF",
    candidates: [
      { name: "Amanda Kulak", committee: "N/A", photo: "amanda-kulak.jpg" },
      { name: "Isabella Tramontin", committee: "Atherton", photo: "isabella-tramontin.jfif" },
      { name: "Evan Varlas", committee: "Walker", photo: "evan-varlas.jpg" }
    ]
  },
  {
    title: "Chief Information Director",
    bg: "#FFFFFF",
    color: "#0A1B3F",
    candidates: [
      { name: "Jenna Fadel", committee: "Sparks", photo: "jenna-fadel.jpg" },
      { name: "Shane Marchok", committee: "Atherton", photo: "shane-marchok.jpg" }
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
