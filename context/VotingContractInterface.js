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
        // Create a provider
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get the network to ensure we're on TestBNB
        const network = await this.provider.getNetwork();
        if (network.chainId !== 97) { // 97 is the chain ID for Binance Smart Chain Testnet
          throw new Error('Please connect to the Binance Smart Chain Testnet');
        }
        
        // Get the signer
        this.signer = this.provider.getSigner();
        
        // Initialize the contract
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

  // Get all voting positions with their candidates and vote counts
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

  // Cast votes for candidates
  castVotes = async (votes, account) => {
    try {
      await this.ensureInitialized();
      
      if (!account) {
        throw new Error('Wallet not connected');
      }
      
      // Format votes for the contract
      const positionIndices = [];
      const candidateSelections = [];
      
      Object.entries(votes).forEach(([position, candidates]) => {
        // Find the position index
        const positionIndex = this.findPositionIndex(position);
        if (positionIndex !== -1) {
          positionIndices.push(positionIndex);
          candidateSelections.push(candidates);
        }
      });
      
      if (positionIndices.length === 0) {
        throw new Error('No valid positions selected');
      }
      
      // Call the contract to cast votes
      const tx = await this.contract.castVotes(positionIndices, candidateSelections);
      return await tx.wait(); // Wait for transaction to be mined
    } catch (error) {
      console.error('Error casting votes:', error);
      throw error;
    }
  };

  // Get voter's selections
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

  // Helper method to ensure the contract is initialized
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
    // This needs to be implemented based on the positions available
    // For now, we'll return a placeholder
    // In a real implementation, you would fetch all positions and find the index
    const positionMap = {
      'Chairman2k': 0,
      'Secretary2k': 1,
      '2kOld': 2,
      '2kNew': 3,
      // Add more as needed
    };
    
    return positionMap[title] !== undefined ? positionMap[title] : -1;
  };
}

export default new VotingContractInterface();