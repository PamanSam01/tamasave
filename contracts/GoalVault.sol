// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract GoalVault {
    error GoalNotFound();
    error NotOwner();
    error GoalIncomplete();
    error AlreadyCompleted();
    error GoalCanceled();

    struct Goal {
        address owner;
        string name;
        address token;
        uint256 targetAmount;
        uint256 savedAmount;
        bool completed;
        bool canceled;
    }

    uint256 public nextGoalId;
    address public treasury;
    address public admin;
    address public schedulerBot;
    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public goalsByOwner;

    constructor(address _treasury) {
        admin = msg.sender;
        treasury = _treasury;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "NOT_ADMIN");
        _;
    }

    function setSchedulerBot(address _bot) external onlyAdmin {
        schedulerBot = _bot;
    }

    event GoalCreated(
        uint256 indexed goalId,
        address indexed owner,
        string name,
        address indexed token,
        uint256 targetAmount
    );
    event Deposited(uint256 indexed goalId, address indexed from, uint256 amount, uint256 savedAmount);
    event Withdrawn(uint256 indexed goalId, address indexed owner, uint256 amount);
    event GoalCanceledEvent(uint256 indexed goalId, address indexed owner, uint256 penalty, uint256 returnAmount);

    function createGoal(string calldata name, uint256 targetAmount, address token) external returns (uint256 goalId) {
        goalId = nextGoalId++;

        goals[goalId] = Goal({
            owner: msg.sender,
            name: name,
            token: token,
            targetAmount: targetAmount,
            savedAmount: 0,
            completed: false,
            canceled: false
        });

        goalsByOwner[msg.sender].push(goalId);
        emit GoalCreated(goalId, msg.sender, name, token, targetAmount);
    }

    function deposit(uint256 goalId, uint256 amount) external {
        Goal storage goal = goals[goalId];
        if (goal.owner == address(0)) revert GoalNotFound();
        if (goal.completed) revert AlreadyCompleted();
        if (goal.canceled) revert GoalCanceled();
        require(msg.sender == goal.owner || msg.sender == schedulerBot, "UNAUTHORIZED_DEPOSITOR");

        bool ok = IERC20(goal.token).transferFrom(goal.owner, address(this), amount);
        require(ok, "TRANSFER_FROM_FAILED");

        goal.savedAmount += amount;
        if (goal.savedAmount >= goal.targetAmount) {
            goal.completed = true;
        }

        emit Deposited(goalId, msg.sender, amount, goal.savedAmount);
    }

    function withdrawWhenCompleted(uint256 goalId) external {
        Goal storage goal = goals[goalId];
        if (goal.owner == address(0)) revert GoalNotFound();
        if (goal.owner != msg.sender) revert NotOwner();
        if (!goal.completed) revert GoalIncomplete();
        if (goal.canceled) revert GoalCanceled();

        uint256 amount = goal.savedAmount;
        goal.savedAmount = 0;

        bool ok = IERC20(goal.token).transfer(goal.owner, amount);
        require(ok, "TRANSFER_FAILED");

        emit Withdrawn(goalId, goal.owner, amount);
    }

    function cancelGoal(uint256 goalId) external {
        Goal storage goal = goals[goalId];
        if (goal.owner == address(0)) revert GoalNotFound();
        if (goal.owner != msg.sender) revert NotOwner();
        if (goal.completed) revert AlreadyCompleted();
        if (goal.canceled) revert GoalCanceled();

        uint256 amount = goal.savedAmount;
        require(amount > 0, "NO_FUNDS_TO_CANCEL");

        goal.savedAmount = 0;
        goal.canceled = true;

        uint256 penalty = (amount * 5) / 100;
        uint256 returnAmount = amount - penalty;

        if (penalty > 0) {
            bool okPenalty = IERC20(goal.token).transfer(treasury, penalty);
            require(okPenalty, "PENALTY_TRANSFER_FAILED");
        }
        
        if (returnAmount > 0) {
            bool okReturn = IERC20(goal.token).transfer(goal.owner, returnAmount);
            require(okReturn, "RETURN_TRANSFER_FAILED");
        }

        emit GoalCanceledEvent(goalId, msg.sender, penalty, returnAmount);
    }

    function getProgress(uint256 goalId) external view returns (uint256 progressBps) {
        Goal storage goal = goals[goalId];
        if (goal.owner == address(0)) revert GoalNotFound();
        if (goal.targetAmount == 0) return 0;

        uint256 progress = (goal.savedAmount * 10_000) / goal.targetAmount;
        return progress > 10_000 ? 10_000 : progress;
    }

    function getOwnerGoals(address owner) external view returns (uint256[] memory) {
        return goalsByOwner[owner];
    }
}
