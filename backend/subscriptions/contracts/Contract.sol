// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity 0.8.19;

contract Subscriptions is Ownable, ReentrancyGuard {
    address public autoPayer = 0x31c9600C79f0824c193cC3Bec1D10D45881aA745; // to change
    uint256 public index;
    uint256 public totalPlans;

    struct Plan {
        uint256 id;
        address manager;
        address tokenAddress;
        uint256 subscribers;
        uint256 planCost;
        uint256 frequency;
        uint256 referralPercentage;
        uint256 earnings;
        IERC20 token;
        bool active;
    }

    mapping(address => mapping(uint256 => uint256)) public start;
    mapping(address => mapping(uint256 => uint256)) public nextPayment;
    mapping(address => mapping(uint256 => bool)) public isActive;
    mapping(address => mapping(uint256 => bytes32)) public userIDHash;

    mapping(uint256 => Plan) public plan;
    mapping(bytes32 => address) public userIDs;
    mapping(uint256 => address) public numberToAddress;
    mapping(uint256 => address) public numberToAddress2;
    mapping(address => bytes32) public addressToID;

    event Subscribed(address indexed subscriber, uint256 indexed planID);
    event Canceled(address indexed subscriber, uint256 indexed planID);
    event Paid(address indexed subscriber, uint256 indexed planID);
    event UserIDChanged(
        address indexed subscriber,
        uint256 indexed planID,
        bytes32 oldUserIDHash,
        bytes32 newUserIDHash
    );

    // createPlan
    function createPlan(
        uint256 cost,
        uint256 frequency,
        uint256 referralPercentage,
        address tokenAddress
    ) public nonReentrant {
        require(referralPercentage >= 0 && referralPercentage <= 100);
        require(cost > 0 && frequency > 0);
        require(tokenAddress != address(0));
        plan[totalPlans] = Plan(
            totalPlans,
            msg.sender,
            tokenAddress,
            0,
            cost,
            frequency,
            referralPercentage,
            0,
            IERC20(tokenAddress),
            true
        );
        totalPlans++;
    }

    function createPlans(
        uint256[] memory cost,
        uint256[] memory frequency,
        uint256[] memory referralPercentage,
        address[] memory tokenAddress
    ) public nonReentrant {
        require(
            cost.length == frequency.length &&
                cost.length == referralPercentage.length &&
                cost.length == tokenAddress.length
        );
        for (uint256 i = 0; i < cost.length; i++) {
            createPlan(
                cost[i],
                frequency[i],
                referralPercentage[i],
                tokenAddress[i]
            );
        }
    }

    // deletePlan
    function deletePlan(uint256 planID) public nonReentrant {
        require(msg.sender == plan[planID].manager);
        plan[planID].active = false;
    }

    // subscribe
    function subscribe(
        uint256 planID,
        bytes32 _userIDHash,
        address referral
    ) public nonReentrant {
        IERC20 token = plan[planID].token;
        uint256 planCost = plan[planID].planCost;
        uint256 frequency = plan[planID].frequency;
        uint256 referralPercentage = plan[planID].referralPercentage;
        require(token.allowance(msg.sender, address(this)) >= planCost);
        require(token.balanceOf(msg.sender) >= planCost);
        require(isActive[msg.sender][planID] == false);
        require(plan[planID].active, "This plan has been deleted");

        token.transferFrom(msg.sender, address(this), planCost);

        if (referral != address(0) && referral != msg.sender) {
            token.transfer(referral, (planCost * referralPercentage) / 100);
        }

        plan[planID].earnings +=
            planCost -
            ((planCost * referralPercentage) / 100);

        start[msg.sender][planID] = block.timestamp;
        nextPayment[msg.sender][planID] = block.timestamp + frequency;
        isActive[msg.sender][planID] = true;
        userIDHash[msg.sender][planID] = _userIDHash;

        userIDs[_userIDHash] = msg.sender;
        addressToID[msg.sender] = _userIDHash;
        numberToAddress[plan[planID].subscribers] = msg.sender;
        numberToAddress2[index] = msg.sender;
        index++;
        plan[planID].subscribers++;

        emit Subscribed(msg.sender, planID);
    }

    // cancel
    function cancel(uint256 planID) public nonReentrant {
        require(isActive[msg.sender][planID] == true);

        isActive[msg.sender][planID] = false;
        plan[planID].subscribers--;

        emit Canceled(msg.sender, planID);
    }

    // pay
    function pay(uint256 planID, address _subscriber) internal {
        IERC20 token = plan[planID].token;
        uint256 planCost = plan[planID].planCost;
        uint256 frequency = plan[planID].frequency;

        require(token.allowance(_subscriber, address(this)) >= planCost);
        require(token.balanceOf(_subscriber) >= planCost);
        require(_subscriber != address(0) && _subscriber == msg.sender);
        require(nextPayment[msg.sender][planID] <= block.timestamp);

        token.transferFrom(_subscriber, address(this), planCost);
        plan[planID].earnings += planCost;
        nextPayment[msg.sender][planID] = block.timestamp + frequency;
        emit Paid(msg.sender, planID);
    }

    // changeuserID
    function changeUserID(
        uint256 planID,
        bytes32 _userIDHash
    ) public nonReentrant {
        require(
            userIDs[_userIDHash] == address(0),
            "userIDHash is already in use"
        );

        bytes32 oldUserIDHash = userIDHash[msg.sender][planID];
        userIDs[oldUserIDHash] = address(0);

        userIDHash[msg.sender][planID] = _userIDHash;
        userIDs[_userIDHash] = msg.sender;

        emit UserIDChanged(msg.sender, planID, oldUserIDHash, _userIDHash);
    }

    // checkDue
    function checkDue(
        uint256 planID,
        address _subscriber
    ) public view returns (bool) {
        require(_subscriber != address(0));
        return
            block.timestamp < nextPayment[_subscriber][planID] ? true : false;
    }

    // autoPay
    function autoPay(uint256 planID, address _subscriber) external {
        require(msg.sender == autoPayer);
        require(_subscriber != address(0), "This subscription does not exist");
        require(
            isActive[_subscriber][planID] == true,
            "This subscription is not active"
        );
        require(!checkDue(planID, _subscriber));

        pay(planID, _subscriber);
    }

    // withdraw
    function withdraw(
        uint256 planID,
        bool withdrawFromAllPlans
    ) public nonReentrant {
        require(msg.sender == plan[planID].manager);
        if (withdrawFromAllPlans) {
            for (uint256 i = 0; i < totalPlans; i++) {
                if (msg.sender == plan[i].manager) {
                    plan[i].token.transfer(msg.sender, plan[i].earnings);
                    plan[i].earnings = 0;
                }
            }
        } else {
            plan[planID].token.transfer(msg.sender, plan[planID].earnings);
            plan[planID].earnings = 0;
        }
    }

    function getManagerPlans(
        address _manager
    ) public view returns (Plan[] memory) {
        Plan[] memory managerPlans = new Plan[](totalPlans);
        uint256 count = 0;
        for (uint256 i = 0; i < totalPlans; i++) {
            if (plan[i].manager == _manager) {
                managerPlans[count] = plan[i];
                count++;
            }
        }
        return managerPlans;
    }

    function changeAutoPayer(address _autoPayer) public onlyOwner {
        autoPayer = _autoPayer;
    }
}
