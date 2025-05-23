// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITRC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
}

contract USDTgStaking {
    ITRC20 public token;
    address public owner;
    uint256 public rewardRatePerSecond = 635; // ~%20 APR için yaklaşık değer

    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardClaimed;
    }

    mapping(address => Stake) public stakes;

    modifier onlyOwner() {
        require(msg.sender == owner, "Sadece kral yapabilir.");
        _;
    }

    constructor(address _tokenAddress) {
        token = ITRC20(_tokenAddress);
        owner = msg.sender;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Bos yatirma mi olur?");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer basarisiz.");

        Stake storage userStake = stakes[msg.sender];

        if (userStake.amount > 0) {
            uint256 pending = calculateReward(msg.sender);
            userStake.rewardClaimed += pending;
        }

        userStake.amount += amount;
        userStake.timestamp = block.timestamp;
    }

    function unstake() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Yatirdigin bir sey yok ki.");

        uint256 pendingReward = calculateReward(msg.sender);
        uint256 totalReward = userStake.rewardClaimed + pendingReward;
        uint256 amountToUnstake = userStake.amount;

        delete stakes[msg.sender];

        require(token.transfer(msg.sender, amountToUnstake), "Ana parani gonderemedik.");
        require(token.transfer(msg.sender, totalReward), "Odulunu gonderemedik.");
    }

    function calculateReward(address staker) public view returns (uint256) {
        Stake memory s = stakes[staker];
        if (s.amount == 0) return 0;

        uint256 duration = block.timestamp - s.timestamp;
        return (s.amount * rewardRatePerSecond * duration) / 1e8;
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(token.transfer(owner, amount), "Cekemedim kral.");
    }

    function updateRewardRate(uint256 newRate) external onlyOwner {
        rewardRatePerSecond = newRate;
    }
}