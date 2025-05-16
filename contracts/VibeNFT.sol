// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VibeNFT
 * @dev A contract that allows users to create, share, and like "vibes" as NFTs.
 * Each vibe contains an emoji, color, phrase, and optional image URI.
 * Users can maintain a streak by creating vibes daily.
 */
contract VibeNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Struct definitions
    struct Vibe {
        string emoji;
        string color;
        string phrase;
        string imageURI;    // URI for GIF or meme image
        uint256 likes;
        uint256 timestamp;
        address creator;
    }

    // State variables
    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => Vibe) public vibes;
    mapping(address => uint256) public userLastVibeTimestamp;
    mapping(address => uint256) public vibeStreak;
    mapping(uint256 => mapping(address => bool)) public hasLiked;

    // Constants
    uint256 public constant STREAK_WINDOW = 1 days;
    uint256 public constant STREAK_RESET_WINDOW = 2 days;
  
    // Events
    event VibeCreated(uint256 tokenId, address creator, string emoji, string color, string phrase, string imageURI);
    event VibeLiked(uint256 tokenId, address liker, uint256 newLikeCount);
    event StreakUpdated(address user, uint256 newStreak);

    /**
     * @dev Constructor initializes the ERC721 token with name and symbol
     */
    constructor() ERC721("VibeNFT", "VIBE") Ownable(msg.sender) {}

    /**
     * @dev Creates a new vibe NFT
     * @param emoji The emoji representing the vibe
     * @param color The color representing the vibe (hex code)
     * @param phrase The phrase or text of the vibe
     * @param imageURI Optional URI for a GIF or meme image
     * @return tokenId The ID of the newly created vibe NFT
     */
    function createVibe(
        string memory emoji, 
        string memory color, 
        string memory phrase,
        string memory imageURI
    ) public returns (uint256) {
        // Check if user can update their streak
        _updateStreak();
        
        // Mint the new vibe NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);

        // Create and store the vibe data
        Vibe memory newVibe = Vibe({
            emoji: emoji,
            color: color,
            phrase: phrase,
            imageURI: imageURI,
            likes: 0,
            timestamp: block.timestamp,
            creator: msg.sender
        });

        vibes[tokenId] = newVibe;
        
        // Emit creation event
        emit VibeCreated(tokenId, msg.sender, emoji, color, phrase, imageURI);
        
        return tokenId;
    }

    /**
     * @dev Like a vibe created by someone else
     * @param tokenId The ID of the vibe to like
     */
    function likeVibe(uint256 tokenId) public {
        require(tokenId < _tokenIdCounter.current(), "VibeNFT: Vibe does not exist");
        require(vibes[tokenId].creator != msg.sender, "VibeNFT: Cannot like your own vibe");
        require(!hasLiked[tokenId][msg.sender], "VibeNFT: Already liked this vibe");
      
        // Record the like
        hasLiked[tokenId][msg.sender] = true;
        vibes[tokenId].likes++;
        
        emit VibeLiked(tokenId, msg.sender, vibes[tokenId].likes);
    }

    /**
     * @dev Retrieves a vibe's details
     * @param tokenId The ID of the vibe to retrieve
     * @return The vibe's details
     */
    function getVibe(uint256 tokenId) public view returns (Vibe memory) {
        require(tokenId < _tokenIdCounter.current(), "VibeNFT: Vibe does not exist");
        return vibes[tokenId];
    }

    /**
     * @dev Gets the user's current streak
     * @param user The address of the user
     * @return The user's current streak
     */
    function getVibeStreak(address user) public view returns (uint256) {
        return vibeStreak[user];
    }

    /**
     * @dev Gets the current token ID counter value
     * @return The current token ID counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Gets the latest vibes, up to a specified limit
     * @param limit Maximum number of vibes to return
     * @return Array of the latest vibe token IDs
     */
    function getLatestVibes(uint256 limit) public view returns (uint256[] memory) {
        uint256 total = _tokenIdCounter.current();
        uint256 count = total < limit ? total : limit;
        
        uint256[] memory result = new uint256[](count);
        
        // Start from the most recent vibe and go backwards
        for (uint256 i = 0; i < count; i++) {
            if (total > 0) {
                result[i] = total - 1 - i;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Gets the most popular vibes by like count, up to a specified limit
     * @param limit Maximum number of vibes to return
     * @return Array of the most popular vibe token IDs
     */
    function getPopularVibes(uint256 limit) public view returns (uint256[] memory) {
        uint256 total = _tokenIdCounter.current();
        uint256 count = total < limit ? total : limit;
        
        // Create array of all token IDs
        uint256[] memory tokenIds = new uint256[](total);
        for (uint256 i = 0; i < total; i++) {
            tokenIds[i] = i;
        }
        
        // Simple bubble sort (not efficient but works for small numbers)
        for (uint256 i = 0; i < total; i++) {
            for (uint256 j = i + 1; j < total; j++) {
                if (vibes[tokenIds[i]].likes < vibes[tokenIds[j]].likes) {
                    // Swap
                    uint256 temp = tokenIds[i];
                    tokenIds[i] = tokenIds[j];
                    tokenIds[j] = temp;
                }
            }
        }
        
        // Take the top 'limit' vibes
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenIds[i];
        }
        
        return result;
    }
    
    /**
     * @dev Gets all vibes created within a time range
     * @param startTime The start of the time range
     * @param endTime The end of the time range
     * @return Array of token IDs within the time range
     */
    function getVibesInTimeRange(uint256 startTime, uint256 endTime) public view returns (uint256[] memory) {
        uint256 count = 0;
        uint256 total = _tokenIdCounter.current();
        
        // First, count matching vibes
        for (uint256 tokenId = 0; tokenId < total; tokenId++) {
            if (tokenId < _tokenIdCounter.current() && vibes[tokenId].timestamp >= startTime && vibes[tokenId].timestamp <= endTime) {
                count++;
            }
        }
        
        // Then, populate the result array
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        for (uint256 tokenId = 0; tokenId < total; tokenId++) {
            if (tokenId < _tokenIdCounter.current() && vibes[tokenId].timestamp >= startTime && vibes[tokenId].timestamp <= endTime) {
                result[resultIndex] = tokenId;
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Gets all vibes created by a specific user
     * @param user The address of the creator
     * @return Array of token IDs created by the user
     */
    function getVibesByUser(address user) public view returns (uint256[] memory) {
        uint256 count = 0;
        uint256 total = _tokenIdCounter.current();
        
        // First, count matching vibes
        for (uint256 tokenId = 0; tokenId < total; tokenId++) {
            if (tokenId < _tokenIdCounter.current() && vibes[tokenId].creator == user) {
                count++;
            }
        }
        
        // Then, populate the result array
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        for (uint256 tokenId = 0; tokenId < total; tokenId++) {
            if (tokenId < _tokenIdCounter.current() && vibes[tokenId].creator == user) {
                result[resultIndex] = tokenId;
                resultIndex++;
            }
        }
        
        return result;
    }

    /**
     * @dev Internal function to update user's streak
     */
    function _updateStreak() internal {
        uint256 lastTimestamp = userLastVibeTimestamp[msg.sender];
        uint256 currentTime = block.timestamp;
        
        // Update user's last vibe timestamp
        userLastVibeTimestamp[msg.sender] = currentTime;
        
        // If this is the first vibe or if last vibe was more than STREAK_RESET_WINDOW ago
        if (lastTimestamp == 0 || currentTime - lastTimestamp > STREAK_RESET_WINDOW) {
            vibeStreak[msg.sender] = 1;
            emit StreakUpdated(msg.sender, 1);
        } 
        // If last vibe was at least STREAK_WINDOW ago (but within STREAK_RESET_WINDOW)
        else if (currentTime - lastTimestamp >= STREAK_WINDOW) {
            vibeStreak[msg.sender]++;
            emit StreakUpdated(msg.sender, vibeStreak[msg.sender]);
        }
        // If last vibe was less than STREAK_WINDOW ago, streak stays the same
    }

    /**
     * @dev Override for tokenURI function from ERC721URIStorage
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override for supportsInterface from ERC721URIStorage
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}