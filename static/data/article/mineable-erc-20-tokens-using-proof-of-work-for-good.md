<!--SUMMARY-START
  {
    "id": 1,
    "thumbnail":
      "/img/thumbnail/1_original.jpg",
    "title": "Mineable ERC-20 Tokens: Using proof-of-work for good",
    "excerpt":
      "I created a ERC-20 token capable of being minted by resolving proof-of-work challenges. By doing that, multiple things back the value of the token: the community and the cost of electricity + gas. And of course, we are wasting electricity just to give value to a token.",
    "timestamp": 1655939484582,
    "tags": [],
    "authorId": 0,
    "categoryId": 5
  }
SUMMARY-END-->
Warning: Unfinished article, expect a lot of mistakes. 

The title of this article is pretty relative, a lot of people think that proof-of-work is some sort of evil and we should to another "more efficient" consensus algorithm for sake of the environment. And there is people like me, that believes that proof-of-work is great, not only for it simplicity but also because it gives value to the token that secures.

So after months of work I finished my new creation: An ERC-20 token capable of being minted by resolving proof-of-work challenges.

# The details
In this article I wanted to explain the core parts of this new token in a faq-style format so it easier to read.

## How it is mined?
Proof-of-work is pretty easy algorithm to implement, especially in solidity, in the official std you have a lot of hashing functions and 256unit support builtin into the language, so it has all the things you need.

You concat the `[nonce: random 20 bytes, recipient: etherum address of the recipient, parent-block-hash: the parent block hash]` and hash it using keccak256 (a.k.a. SHA-3). You do this until the hash output reaches the difficulty target.

Then to get your reward you have to call the mine method with the nonce and the recipient address.

This method does 3 things in a nutshell:
- Computes hash using the `nonce`, `recipient` and `parent-block-hash` variables.
- Calculates the current difficulty target.
- Checks if the hash reached the difficulty target.

```solidity
function mine(bytes32 nonce, address recipient) public virtual override {
  require(recipient != address(0), "Mine: invalid.address");

  Block memory parentBlock = _blocks[_currentBlockIndex];

  bytes32 blockHash = ProofOfWork.computeHash(
    bytes.concat(nonce, bytes20(recipient), parentBlock.hash)
  );

  uint256 blockDifficulty = ProofOfWork.calculateDifficulty(
    block.timestamp,
    parentBlock.timestamp,
    parentBlock.difficulty,
    _maximumDivisor,
    _durationLimit
  );

  require(
    _verifyDifficulty(blockHash, blockDifficulty),
    "Mine: target.not.reached"
  );

  _addBlock(block.timestamp, blockDifficulty, blockHash, recipient);
}
```

## How the difficulty is calculated?
I sort of rip-off it from bitcoin but it's not 1:1 copy.

Anyway, it's pretty easy to understand, this method does this:
- if time between the current and parent block, the delta, surpasses the duration limit constant, it lowers the difficulty
- if the delta is lower than duration limit constant adds more difficulty
- if it is equal to the duration limit constant keeps the same difficulty.

```solidity
function calculateDifficulty(
  uint256 currentTimestamp,
  uint256 parentTimestamp,
  uint256 parentDifficulty,
  uint8 maximumDivisor,
  uint32 durationLimit
) internal pure returns (uint256) {
  uint256 delta = currentTimestamp - parentTimestamp;

  if (parentDifficulty < maximumDivisor) {
    return maximumDivisor;
  }

  uint256 quotient = parentDifficulty / maximumDivisor;

  if (durationLimit > delta) {
    return parentDifficulty + quotient;
  } else if (durationLimit < delta) {
    return parentDifficulty - quotient;
  }

  return parentDifficulty;
}
```

## How the reward is calculated?
Well, it's a 1:1 copy from bitcoin, it halves the initial reward every time that block limit reaches the subsidy halving interval constant.

```solidity
function calculate(
  uint256 blockIndex,
  uint256 initialReward,
  uint256 subsidyHalvingInterval
) internal pure returns (uint256) {
  uint256 halvings = blockIndex / subsidyHalvingInterval;

  initialReward >>= halvings;

  return initialReward;
}
```

## Is there going to be a new standard for token mining?
Yes, it's called `MG-01`, you can find more information about it [here](https://github.com/magicaldotsh/standards/blob/master/MG-01.md) (it's not finished and the repo is private for now).

# The end
That's all I believe that you should know about the token for now. In the future probably I'm going to announce more updates about this new token.

Have a nice week!