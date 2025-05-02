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
      
      //formatting votes
      const positionIndices = [];
      const candidateSelections = [];
      
      Object.entries(votes).forEach(([position, candidates]) => {
        // position index
        const positionIndex = this.findPositionIndex(position);
        if (positionIndex !== -1) {
          positionIndices.push(positionIndex);
          candidateSelections.push(candidates);
        }
      });
      
      if (positionIndices.length === 0) {
        throw new Error('No valid positions selected');
      }
      
      // calling contract
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
  findPositionIndex = (title) => {
    const positionMap = {
      'University Relations Director': 0,
      'Director of Communications': 1,
      'Secretary': 2,
      '2kOld Committee Directors': 3,
      '2kNew Committee Directors': 4,
      'Director of Internal Affairs': 5,
      'Tour Director': 6,
      'Chief Information Director': 7
    };
    
    return positionMap[title] !== undefined ? positionMap[title] : -1;
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
}

export default new VotingContractInterface();