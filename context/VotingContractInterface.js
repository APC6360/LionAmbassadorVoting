import { ethers } from 'ethers';
import CandidateVotingABI from './CandidateVotingABI.json';
import { positions } from '../components/Dashboard/candidatesData';


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
  // Add this method to your VotingContractInterface class
getAllContractPositions = async () => {
    try {
      await this.ensureInitialized();
      
      const positionCount = await this.contract.getPositionCount();
      console.log(`Total positions in contract: ${positionCount.toNumber()}`);
      
      if (positionCount.toNumber() === 0) {
        console.error("No positions found in the contract. Admin needs to add positions first.");
        return [];
      }
      
      const positions = [];
      for (let i = 0; i < positionCount.toNumber(); i++) {
        const positionInfo = await this.contract.getPosition(i);
        positions.push({
          index: i,
          title: positionInfo.title,
          maxVotes: positionInfo.maxVotes.toNumber(),
          candidateCount: positionInfo.candidateCount
        });
        console.log(`Position ${i}: "${positionInfo.title}" (Max votes: ${positionInfo.maxVotes})`);
      }
      
      console.table(positions);
      return positions;
    } catch (error) {
      console.error('Error getting contract positions:', error);
      return [];
    }
  };
  // Add this method to your VotingContractInterface class
addPositions = async () => {
    try {
      await this.ensureInitialized();
      
      // Check if we're the admin
      const admin = await this.contract.admin();
      const currentAccount = await this.signer.getAddress();
      
      if (admin.toLowerCase() !== currentAccount.toLowerCase()) {
        console.error('Only the contract admin can add positions');
        return false;
      }
      
      // Add positions if they don't exist
      const positionCount = await this.contract.getPositionCount();
      if (positionCount.toNumber() > 0) {
        console.log('Positions already exist in the contract');
        return true;
      }
      
      // Add all the positions from candidatesData.js
      const positionsToAdd = [
        { title: "University Relations Director", maxVotes: 1 },
        { title: "Director of Communications", maxVotes: 1 },
        { title: "Secretary", maxVotes: 1 },
        { title: "2kOld Committee Directors", maxVotes: 3 },
        { title: "2kNew Committee Directors", maxVotes: 3 },
        { title: "Director of Internal Affairs", maxVotes: 1 },
        { title: "Tour Director", maxVotes: 1 },
        { title: "Chief Information Director", maxVotes: 1 }
      ];
      
      for (const position of positionsToAdd) {
        console.log(`Adding position: ${position.title} with max votes: ${position.maxVotes}`);
        const tx = await this.contract.addPosition(position.title, position.maxVotes);
        await tx.wait();
      }
      
      console.log('All positions added successfully');
      return true;
    } catch (error) {
      console.error('Error adding positions:', error);
      return false;
    }
  };
  // Add this method to your VotingContractInterface class
    addCandidates = async () => {
    try {
      await this.ensureInitialized();
      
      // Check if we're the admin
      const admin = await this.contract.admin();
      const currentAccount = await this.signer.getAddress();
      
      if (admin.toLowerCase() !== currentAccount.toLowerCase()) {
        console.error('Only the contract admin can add candidates');
        return false;
      }
      
      // Import candidates data
      
      // Check position count
      const positionCount = await this.contract.getPositionCount();
      if (positionCount.toNumber() !== positions.length) {
        console.error('Position count mismatch. Add positions first.');
        return false;
      }
      
      // Add candidates for each position
      for (let i = 0; i < positions.length; i++) {
        const candidateCount = await this.contract.getCandidateCount(i);
        
        // Skip if candidates already exist for this position
        if (candidateCount.toNumber() > 0) {
          console.log(`Candidates already exist for position ${i}: ${positions[i].title}`);
          continue;
        }
        
        // Add all candidates for this position
        for (const candidate of positions[i].candidates) {
          console.log(`Adding candidate: ${candidate.name} to position: ${positions[i].title}`);
          const tx = await this.contract.addCandidate(
            i,
            candidate.name,
            candidate.committee,
            candidate.photo
          );
          await tx.wait();
        }
      }
      
      console.log('All candidates added successfully');
      return true;
    } catch (error) {
      console.error('Error adding candidates:', error);
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
      
      const positionCount = await this.contract.getPositionCount();
      if (positionCount.toNumber() === 0) {
        throw new Error('No positions found in the contract. Admin needs to add positions first.');
      }
      
      console.log('Votes to submit:', votes);
      
      // Format votes for the contract
      const positionIndices = [];
      const candidateSelections = [];
      
      // Process positions sequentially
      for (const [position, candidates] of Object.entries(votes)) {
        // Find position index
        const positionIndex = await this.findPositionIndex(position);
        console.log(`Position: "${position}", Index: ${positionIndex}`);
        
        if (positionIndex !== -1) {
          positionIndices.push(positionIndex);
          candidateSelections.push(candidates);
        } else {
          console.error(`Position not found: ${position}`);
        }
      }
      
      if (positionIndices.length === 0) {
        throw new Error('No valid positions selected');
      }
      
      console.log('Position indices:', positionIndices);
      console.log('Candidate selections:', candidateSelections);
      
      // Call the contract to cast votes
      const tx = await this.contract.castVotes(positionIndices, candidateSelections);
      return await tx.wait(); // Wait for transaction to be mined
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

 
findPositionIndex = async (title) => {
    try {
      await this.ensureInitialized();
      
      const positionCount = await this.contract.getPositionCount();
      
      if (positionCount.toNumber() === 0) {
        console.error('No positions found in the contract');
        return -1;
      }
      
      // Search for the position by title
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