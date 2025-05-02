// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CandidateVoting {
    // Structure to store candidate information
    struct Candidate {
        string name;
        string committee;
        string photoUrl;
        uint256 voteCount;
    }

    // Structure to store position information
    struct Position {
        string title;
        Candidate[] candidates;
        uint256 maxVotes; // Maximum votes allowed for this position (1 or 3)
    }

    // Array to store all positions
    Position[] public positions;
    
    // Mapping from voter address to position to candidates they voted for
    mapping(address => mapping(uint256 => string[])) public voterSelections;
    
    // Total number of voters
    uint256 public voterCount;

    // Admin address
    address public admin;
    
    // Event emitted when votes are cast
    event VotesCast(address indexed voter, string[] positions, string[] selections);
    
    // Constructor to initialize the contract with positions and candidates
    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict function access to admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Function to add a position
    function addPosition(string memory _title, uint256 _maxVotes) public onlyAdmin {
        require(_maxVotes > 0, "Max votes must be greater than zero");
        Position storage newPosition = positions.push();
        newPosition.title = _title;
        newPosition.maxVotes = _maxVotes;
    }

    // Function to add a candidate to a position
    function addCandidate(
        uint256 _positionIndex,
        string memory _name,
        string memory _committee,
        string memory _photoUrl
    ) public onlyAdmin {
        require(_positionIndex < positions.length, "Position does not exist");
        
        Candidate memory newCandidate = Candidate({
            name: _name,
            committee: _committee,
            photoUrl: _photoUrl,
            voteCount: 0
        });
        
        positions[_positionIndex].candidates.push(newCandidate);
    }

    // Function to cast votes for candidates in different positions
    function castVotes(uint256[] memory _positionIndices, string[][] memory _candidateNames) public {
        require(_positionIndices.length == _candidateNames.length, "Position and candidate arrays must be the same length");
        
        // Check if voter has already voted
        bool isNewVoter = true;
        for (uint256 i = 0; i < positions.length; i++) {
            if (voterSelections[msg.sender][i].length > 0) {
                isNewVoter = false;
                break;
            }
        }
        
        if (isNewVoter) {
            voterCount++;
        }
        
        string[] memory positionTitles = new string[](_positionIndices.length);
        string[] memory allSelections = new string[](_positionIndices.length);
        
        for (uint256 i = 0; i < _positionIndices.length; i++) {
            uint256 positionIndex = _positionIndices[i];
            require(positionIndex < positions.length, "Position does not exist");
            
            Position storage position = positions[positionIndex];
            require(_candidateNames[i].length <= position.maxVotes, "Too many candidates selected for this position");
            
            // Reset previous votes for this position
            string[] memory previousVotes = voterSelections[msg.sender][positionIndex];
            if (previousVotes.length > 0) {
                // Decrease vote counts for previously selected candidates
                for (uint256 j = 0; j < previousVotes.length; j++) {
                    decreaseCandidateVote(positionIndex, previousVotes[j]);
                }
            }
            
            // Store new votes
            voterSelections[msg.sender][positionIndex] = _candidateNames[i];
            
            // Increase vote counts for newly selected candidates
            for (uint256 j = 0; j < _candidateNames[i].length; j++) {
                increaseCandidateVote(positionIndex, _candidateNames[i][j]);
            }
            
            positionTitles[i] = position.title;
            allSelections[i] = concatStrings(_candidateNames[i]);
        }
        
        emit VotesCast(msg.sender, positionTitles, allSelections);
    }
    
    // Helper function to concatenate strings for the event
    function concatStrings(string[] memory strs) internal pure returns (string memory) {
        if (strs.length == 0) return "";
        if (strs.length == 1) return strs[0];
        
        string memory result = strs[0];
        for (uint256 i = 1; i < strs.length; i++) {
            result = string(abi.encodePacked(result, ", ", strs[i]));
        }
        return result;
    }
    
    // Helper function to increase a candidate's vote count
    function increaseCandidateVote(uint256 _positionIndex, string memory _candidateName) internal {
        Position storage position = positions[_positionIndex];
        for (uint256 i = 0; i < position.candidates.length; i++) {
            if (keccak256(bytes(position.candidates[i].name)) == keccak256(bytes(_candidateName))) {
                position.candidates[i].voteCount++;
                break;
            }
        }
    }
    
    // Helper function to decrease a candidate's vote count
    function decreaseCandidateVote(uint256 _positionIndex, string memory _candidateName) internal {
        Position storage position = positions[_positionIndex];
        for (uint256 i = 0; i < position.candidates.length; i++) {
            if (keccak256(bytes(position.candidates[i].name)) == keccak256(bytes(_candidateName))) {
                if (position.candidates[i].voteCount > 0) {
                    position.candidates[i].voteCount--;
                }
                break;
            }
        }
    }
    
    // Function to get position details
    function getPosition(uint256 _positionIndex) public view returns (
        string memory title,
        uint256 maxVotes,
        uint256 candidateCount
    ) {
        require(_positionIndex < positions.length, "Position does not exist");
        
        Position storage position = positions[_positionIndex];
        return (position.title, position.maxVotes, position.candidates.length);
    }
    
    // Function to get candidate details
    function getCandidate(uint256 _positionIndex, uint256 _candidateIndex) public view returns (
        string memory name,
        string memory committee,
        string memory photoUrl,
        uint256 voteCount
    ) {
        require(_positionIndex < positions.length, "Position does not exist");
        require(_candidateIndex < positions[_positionIndex].candidates.length, "Candidate does not exist");
        
        Candidate storage candidate = positions[_positionIndex].candidates[_candidateIndex];
        return (candidate.name, candidate.committee, candidate.photoUrl, candidate.voteCount);
    }
    
    // Function to get position count
    function getPositionCount() public view returns (uint256) {
        return positions.length;
    }
    
    // Function to get candidate count for a position
    function getCandidateCount(uint256 _positionIndex) public view returns (uint256) {
        require(_positionIndex < positions.length, "Position does not exist");
        return positions[_positionIndex].candidates.length;
    }
    
    // Function to check if a voter has voted for specific candidates in a position
    function getVoterSelections(address _voter, uint256 _positionIndex) public view returns (string[] memory) {
        require(_positionIndex < positions.length, "Position does not exist");
        return voterSelections[_voter][_positionIndex];
    }
}