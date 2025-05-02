import { ethers } from 'ethers';
import CandidateVotingABI from './CandidateVotingABI.json';

class VotingContractInterface {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS;
  }

  initialize = async () => {
    try {
      if (window.ethereum) {
    
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        //testbnb network
        const network = await this.provider.getNetwork();
        if (network.chainId !== 97) {
          throw new Error('Please connect to the Binance Smart Chain Testnet');
        }
        
        // Get the signer
        this.signer = this.provider.getSigner();
        
        // contract initliazation 
        this.contract = new ethers.Contract(
          this.contractAddress,
          CandidateVotingABI,
          this.signer
        );
        
        return true;
      } else {
        throw new Error('Ethereum object not found. Please install MetaMask.');
      }
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      return false;
    }
  };

  // voting positions and candidates
  getAllPositionsWithCandidates = async () => {
    try {
      await this.ensureInitialized();
      
      const positionCount = await this.contract.getPositionCount();
      const positions = [];
      
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const positionInfo = await this.contract.getPosition(i);
        const candidateCount = positionInfo.candidateCount.toNumber();
        
        const candidates = [];
        for (let j = 0; j < candidateCount; j++) {
          const candidate = await this.contract.getCandidate(i, j);
          candidates.push({
            name: candidate.name,
            committee: candidate.committee,
            photoUrl: candidate.photoUrl,
            voteCount: candidate.voteCount.toNumber()
          });
        }
        
        positions.push({
          title: positionInfo.title,
          maxVotes: positionInfo.maxVotes.toNumber(),
          candidates: candidates
        });
      }
      
      return positions;
    } catch (error) {
      console.error('Error fetching positions and candidates:', error);
      throw error;
    }
  };

  //cast votes
  castVotes = async (votes, account) => {
    try {
      await this.ensureInitialized();
      
      if (!account) {
        throw new Error('Wallet not connected');
      }
      
     
      const positionIndices = [];
      const candidateSelections = [];
      
     
      for (const [position, candidates] of Object.entries(votes)) {
       
        const positionIndex = await this.findPositionIndex(position);
        console.log(`Position: ${position}, Index: ${positionIndex}`);
        
        if (positionIndex !== -1) {
          positionIndices.push(positionIndex);
          candidateSelections.push(candidates);
        } else {
          console.error(`Invalid position: ${position}`);
        }
      }
      
      if (positionIndices.length === 0) {
        throw new Error('No valid positions selected');
      }
      
      console.log('Position indices to submit:', positionIndices);
      console.log('Candidate selections to submit:', candidateSelections);
      
      
      const tx = await this.contract.castVotes(positionIndices, candidateSelections);
      return await tx.wait(); 
    } catch (error) {
      console.error('Error casting votes:', error);
      throw error;
    }
  };

  //voter selections
  getVoterSelections = async (account) => {
    try {
      await this.ensureInitialized();
      
      if (!account) {
        throw new Error('Wallet not connected');
      }
      
      const positionCount = await this.contract.getPositionCount();
      const selections = {};
      
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const positionInfo = await this.contract.getPosition(i);
        const voterSelections = await this.contract.getVoterSelections(account, i);
        
        if (voterSelections.length > 0) {
          selections[positionInfo.title] = voterSelections;
        }
      }
      
      return selections;
    } catch (error) {
      console.error('Error fetching voter selections:', error);
      throw error;
    }
  };

  //ensure contract is initialized
  ensureInitialized = async () => {
    if (!this.contract) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Contract not initialized');
      }
    }
  };

  // Helper method to find position index by title
  findPositionIndex = async (title) => {
    try {
      await this.ensureInitialized();
      
    
      const positionCount = await this.contract.getPositionCount();
      
     
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const positionInfo = await this.contract.getPosition(i);
        
      
        if (positionInfo.title === title) {
          return i;
        }
      }
      
     
      console.error(`Position not found in contract: ${title}`);
      return -1;
    } catch (error) {
      console.error('Error finding position index:', error);
      return -1;
    }
  };
 
    logAllPositions = async () => {
     try {
      await this.ensureInitialized();
      
      const positionCount = await this.contract.getPositionCount();
      console.log(`Total positions: ${positionCount}`);
      
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const positionInfo = await this.contract.getPosition(i);
        console.log(`Position ${i}: ${positionInfo.title}`);
      }
    } catch (error) {
      console.error('Error logging positions:', error);
    }
  };
  
debugPositions = async () => {
    try {
      await this.ensureInitialized();
      
      const positionCount = await this.contract.getPositionCount();
      console.log(`Total positions in contract: ${positionCount}`);
      
      const positions = [];
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const position = await this.contract.getPosition(i);
        console.log(`Position ${i}: ${position.title}`);
        positions.push({
          index: i,
          title: position.title,
          maxVotes: position.maxVotes.toNumber(),
          candidateCount: position.candidateCount.toNumber()
        });
      }
      
      console.table(positions);
      return positions;
    } catch (error) {
      console.error('Error debugging positions:', error);
      return [];
    }
  };
}

export default new VotingContractInterface();