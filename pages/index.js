import React from 'react'
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <PageContainer>
        <Navbar />
        <HeaderTitle>Lion Ambassadors Voting</HeaderTitle>
        <ClassImageWrapper>
          <ClassImage src="/photos/2K25.jpg" alt="Lion Ambassadors Class" width={800} height={450} />
        </ClassImageWrapper>
        <HeaderSection>
          <ContentSection>
            <MainTitle>Welcome to the Executive Voting Portal</MainTitle>
            <Subtitle>
              Your voice matters. Vote for the future of the Penn State Student Alumni Corps.
            </Subtitle>
            <ButtonGroup>
              <VoteButton href="/vote">Vote Now</VoteButton>
              <ViewCandidates href="/candidates/Candidates">View Candidates</ViewCandidates>
            </ButtonGroup>
          </ContentSection>
        </HeaderSection>

        <ExecSection>
          <ExecTitle>Meet the Current Leadership</ExecTitle>
          <ExecGrid>
            <ExecCard>
              <ExecImage src="/photos/max-gibbard.jpg" alt="Max Gibbard" width={200} height={200} />
              <ExecName>Max Gibbard</ExecName>
              <ExecRole>President</ExecRole>
            </ExecCard>
            <ExecCard>
              <ExecImage src="/photos/olivia-fisher.jfif" alt="Olivia Fisher" width={200} height={200} />
              <ExecName>Olivia Fisher</ExecName>
              <ExecRole>Executive Vice President</ExecRole>
            </ExecCard>
            <ExecCard>
              <ExecImage src="/photos/marley-fish.jpg" alt="Marley Fish" width={200} height={200} />
              <ExecName>Marley Fish</ExecName>
              <ExecRole>Administrative Vice President</ExecRole>
            </ExecCard>
          </ExecGrid>
        </ExecSection>
        <MissionSection>
          <MissionTitle>Who are the Lion Ambassadors?</MissionTitle>
          <MissionText>
            Lion Ambassadors aim to communicate Penn State’s <Emphasized>history</Emphasized> & <strong>personality</strong>, strengthen University <Underlined>traditions</Underlined>,
            and instill Penn State <strong>pride</strong> in current and future students, alumni, and friends.
            We strive to foster the idea that involvement with Penn State is a <Underlined>lifelong</Underlined> <Underlined>commitment</Underlined>.
          </MissionText>
          <MissionText>
            As the Student Alumni Corps, L’Ambs proudly represent the <strong>Penn State Alumni Association</strong> in order to host
            events and programming that show our dedication to this mission.
          </MissionText>
        </MissionSection>

        
      </PageContainer>
    </>
  )
}

const PageContainer = styled.div`
  background-color: #0A1B3F;
  font-family: 'Gill Sans MT', sans-serif;
  color: #FFFFFF;
  min-height: 100vh;
`;

const HeaderTitle = styled.h1`
  font-size: 48px;
  text-align: center;
  padding: 20px 10px 0;
`;

const ClassImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 30px;
`;

const ClassImage = styled(Image)`
  border-radius: 12px;
  max-width: 90%;
  height: auto;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 20px;
  align-items: center;
  text-align: center;
`;

const ContentSection = styled.div`
  max-width: 800px;
`;

const MainTitle = styled.h2`
  font-size: 42px;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const VoteButton = styled(Link)`
  background-color: #FFFFFF;
  color: black;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
`;

const ViewCandidates = styled(Link)`
  background-color: #FFFFFF;
  color: black;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
`;

const MissionSection = styled.div`
  padding: 60px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  
  font-size: 22px;
  line-height: 1.8;
  text-align: center;
`;

const MissionTitle = styled.h3`
  font-size: 28px;
  margin-bottom: 20px;
`;

const MissionText = styled.p`
  margin-bottom: 20px;
`;

const Emphasized = styled.span`
  font-style: italic;
  border-bottom: 2px solid #fff;
`;

const Underlined = styled.span`
  text-decoration: underline;
`;

const ExecSection = styled.section`
  background-color: #FFFFFF;
  color: #0A1B3F;
  padding: 60px 20px;
  text-align: center;
  margin-bottom: 0;
`;

const ExecTitle = styled.h2`
  font-size: 36px;
  margin-bottom: 40px;
`;

const ExecGrid = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  justify-items: center;
`;

const ExecCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ExecImage = styled(Image)`
  border-radius: 12px;
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

const ExecName = styled.h4`
  font-size: 20px;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const ExecRole = styled.p`
  font-size: 16px;
  color: #333;
`;
