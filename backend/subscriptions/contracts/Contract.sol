// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity 0.8.19;

contract Subscriptions is Ownable, ReentrancyGuard {
    address public autoPayer = 0x9E4e16151f9fB31f9943eEAbF02C3d41Bf4aBe55; // to change
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
    }

    struct Subscription {
        address subscriber;
        mapping(uint256 => uint256) start;
        mapping(uint256 => uint256) nextPayment;
        mapping(uint256 => bool) isActive;
        mapping(uint256 => bytes32) userIDHash;
    }

    mapping(address => Subscription) public subscriptions;
    mapping(uint256 => Plan) public plan;
    mapping(bytes32 => address) public userIDs;
    mapping(uint256 => address) public numberToAddress;
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
            IERC20(tokenAddress)
        );
        totalPlans++;
    }

    // deletePlan
    function deletePlan(uint256 planID) public nonReentrant {
        require(msg.sender == plan[planID].manager);
        delete plan[planID];
    }

    // subscribe
    function subscribe(
        uint256 planID,
        bytes32 userIDHash,
        address referral
    ) public nonReentrant {
        IERC20 token = plan[planID].token;
        uint256 planCost = plan[planID].planCost;
        uint256 frequency = plan[planID].frequency;
        uint256 referralPercentage = plan[planID].referralPercentage;
        require(token.allowance(msg.sender, address(this)) >= planCost);
        require(token.balanceOf(msg.sender) >= planCost);
        require(subscriptions[msg.sender].isActive[planID] == false);

        token.transferFrom(msg.sender, address(this), planCost);

        if (referral != address(0) && referral != msg.sender) {
            token.transfer(referral, (planCost * referralPercentage) / 100);
        }

        plan[planID].earnings +=
            planCost -
            ((planCost * referralPercentage) / 100);

        subscriptions[msg.sender].subscriber = msg.sender;
        subscriptions[msg.sender].start[planID] = block.timestamp;
        subscriptions[msg.sender].nextPayment[planID] =
            block.timestamp +
            frequency;
        subscriptions[msg.sender].isActive[planID] = true;
        subscriptions[msg.sender].userIDHash[planID] = userIDHash;

        userIDs[userIDHash] = msg.sender;
        addressToID[msg.sender] = userIDHash;
        numberToAddress[index] = msg.sender;
        index++;
        plan[planID].subscribers++;

        emit Subscribed(msg.sender, planID);
    }

    // cancel
    function cancel(uint256 planID) public nonReentrant {
        require(subscriptions[msg.sender].subscriber == msg.sender);
        require(subscriptions[msg.sender].isActive[planID] == true);

        subscriptions[msg.sender].isActive[planID] = false;
        plan[planID].subscribers--;

        emit Canceled(msg.sender, planID);
    }

    // pay
    function pay(uint256 planID, address _subscriber) internal {
        Subscription storage subscription = subscriptions[_subscriber];
        IERC20 token = plan[planID].token;
        uint256 planCost = plan[planID].planCost;
        uint256 frequency = plan[planID].frequency;

        require(token.allowance(_subscriber, address(this)) >= planCost);
        require(token.balanceOf(_subscriber) >= planCost);
        require(
            subscription.subscriber != address(0) &&
                subscription.subscriber == msg.sender
        );
        require(subscription.nextPayment[planID] <= block.timestamp);

        token.transferFrom(_subscriber, address(this), planCost);
        plan[planID].earnings += planCost;
        subscription.nextPayment[planID] = block.timestamp + frequency;
        emit Paid(msg.sender, planID);
    }

    // changeuserID
    function changeUserID(
        uint256 planID,
        bytes32 userIDHash
    ) public nonReentrant {
        require(
            subscriptions[msg.sender].subscriber != address(0),
            "Subscriber does not exist"
        );
        require(
            subscriptions[msg.sender].subscriber == msg.sender,
            "Sender is not the subscriber"
        );
        require(
            userIDs[userIDHash] == address(0),
            "userIDHash is already in use"
        );

        bytes32 oldUserIDHash = subscriptions[msg.sender].userIDHash[planID];
        userIDs[oldUserIDHash] = address(0);

        subscriptions[msg.sender].userIDHash[planID] = userIDHash;
        userIDs[userIDHash] = msg.sender;

        emit UserIDChanged(msg.sender, planID, oldUserIDHash, userIDHash);
    }

    // checkDue
    function checkDue(
        uint256 planID,
        address _subscriber
    ) public view returns (bool) {
        require(_subscriber != address(0));
        return
            block.timestamp < subscriptions[_subscriber].nextPayment[planID]
                ? true
                : false;
    }

    // autoPay
    function autoPay(uint256 planID, address _subscriber) external {
        require(msg.sender == autoPayer);
        require(
            subscriptions[_subscriber].subscriber != address(0),
            "This subscription does not exist"
        );
        require(
            subscriptions[_subscriber].subscriber == _subscriber,
            "Sender is not the subscriber"
        );
        require(
            subscriptions[_subscriber].isActive[planID] == true,
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

    function getManagerPlans(address _manager)
        public
        view
        returns (Plan[] memory)
    {
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
}
