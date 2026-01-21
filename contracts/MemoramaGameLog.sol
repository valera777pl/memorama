// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MemoramaGameLog
 * @notice Records Memorama game moves on-chain using events for minimal gas cost
 * @dev Uses events (~8k gas) instead of storage (~20k gas) for cost efficiency
 */
contract MemoramaGameLog {
    // Events for game lifecycle
    event GameStarted(
        bytes32 indexed gameId,
        address indexed player,
        uint8 difficulty,
        uint256 timestamp
    );

    event CardFlipped(
        bytes32 indexed gameId,
        address indexed player,
        uint8 cardIndex,
        uint8 moveNumber,
        uint256 timestamp
    );

    event MatchFound(
        bytes32 indexed gameId,
        address indexed player,
        uint8 card1,
        uint8 card2,
        uint256 timestamp
    );

    event GameCompleted(
        bytes32 indexed gameId,
        address indexed player,
        uint8 moves,
        uint256 time,
        uint256 score,
        uint256 timestamp
    );

    // Minimal storage to prevent duplicate games
    mapping(bytes32 => bool) public gameExists;

    /**
     * @notice Start a new game
     * @param gameId Unique identifier for the game (keccak256 hash)
     * @param difficulty Game difficulty (0=easy, 1=medium, 2=hard)
     */
    function startGame(bytes32 gameId, uint8 difficulty) external {
        require(!gameExists[gameId], "Game exists");
        gameExists[gameId] = true;
        emit GameStarted(gameId, msg.sender, difficulty, block.timestamp);
    }

    /**
     * @notice Record a card flip
     * @param gameId The game identifier
     * @param cardIndex Index of the flipped card
     * @param moveNumber The move number in the game
     */
    function recordFlip(bytes32 gameId, uint8 cardIndex, uint8 moveNumber) external {
        emit CardFlipped(gameId, msg.sender, cardIndex, moveNumber, block.timestamp);
    }

    /**
     * @notice Record a successful match
     * @param gameId The game identifier
     * @param card1 Index of first matched card
     * @param card2 Index of second matched card
     */
    function recordMatch(bytes32 gameId, uint8 card1, uint8 card2) external {
        emit MatchFound(gameId, msg.sender, card1, card2, block.timestamp);
    }

    /**
     * @notice Complete a game and record final stats
     * @param gameId The game identifier
     * @param moves Total number of moves
     * @param time Time taken in seconds
     * @param score Final score
     */
    function completeGame(bytes32 gameId, uint8 moves, uint256 time, uint256 score) external {
        emit GameCompleted(gameId, msg.sender, moves, time, score, block.timestamp);
    }
}
