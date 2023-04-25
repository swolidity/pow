// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract ProofOfWorkout is ERC721Enumerable, Ownable {
  uint256 public constant MAX_TOKENS = 1000;

  uint256 private _tokenCounter = 0;

  struct ExerciseSet {
    string name;
    uint256 repetitions;
  }

  mapping(uint256 => ExerciseSet[]) private _workouts;

  event MintWorkout(ExerciseSet[] exerciseSets);

  constructor() ERC721("Proof Of Workout", "POW") {}

  function mintWorkout(ExerciseSet[] calldata exerciseSets) public payable {
    require(_tokenCounter <= MAX_TOKENS, "Maximum tokens have been minted");
    require(exerciseSets.length > 0);

    uint256 tokenId = _tokenCounter;

    for (uint256 i = 0; i < exerciseSets.length; i++) {
      ExerciseSet memory set = exerciseSets[i];
      _workouts[tokenId].push(set);
    }

    emit MintWorkout(exerciseSets);

    _safeMint(msg.sender, tokenId);

    _tokenCounter++;
  }

  function getWorkout(uint256 tokenId) public view returns (ExerciseSet[] memory) {
    require(_exists(tokenId), "Token ID does not exist");
    return _workouts[tokenId];
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "Token ID does not exist");

    ExerciseSet[] memory workout = _workouts[tokenId];

    string[8] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 350">';
    for (uint256 i = 0; i < workout.length; i++) {
      ExerciseSet memory exerciseSet = workout[i];
      parts[1] = string(
        abi.encodePacked(
          parts[1],
          '<text x="10" y="',
          Strings.toString(50 + i * 30),
          '" font-size="20">',
          exerciseSet.name,
          ": ",
          Strings.toString(exerciseSet.repetitions),
          " reps, ",
          "</text>"
        )
      );
    }
    parts[2] = "</svg>";

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2]));
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Proof of Workout #',
            Strings.toString(tokenId),
            '", "description": "Did you workout today anon? Be one the first to record a workout on the Ethereum blockchain", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(output)),
            '"}'
          )
        )
      )
    );
    return string(abi.encodePacked("data:application/json;base64,", json));
  }

  function forSarah() external pure returns (string memory) {
    return "I love you.";
  }
}
