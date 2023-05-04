import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.19;

contract Subscriptions is Ownable {
    address public owner = 0x9E4e16151f9fB31f9943eEAbF02C3d41Bf4aBe55; // to change
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
    mapping(address => Plan) public plan;
    mapping(bytes32 => address) public userIDs;
    mapping(uint256 => address) public numberToAddress;
    mapping(address => bytes32) public addressToID;

    event Subscribed(address indexed subscriber, uint256 indexed planID);
    event Canceled(address indexed subscriber, uint256 indexed planID);
    event Paid(address indexed subscriber, uint256 indexed planID);
    event UserIDChanged(address indexed subscriber, uint256 indexed planID, bytes32 oldUserIDHash, bytes32 newUserIDHash);



    function createPlan(uint256 cost, uint256 frequency, uint256 referralPercentage,address tokenAddress) public {
        plans[totalPlans] = Plan(totalPlans, msg.sender, tokenAddress, 0, cost, frequency, referralPercentage,IERC20(tokenAddress));
        totalPlans++;
    }

    function deletePlan(uint256 planID) public {
        require(msg.sender == plans[planID].manager);
        delete plans[planID];
    }

    // subscribe
    function subscribe(uint256 planID, bytes32 userIDHash, address referral) public {
        Plan storage plan = plans[planID];
        IERC20 token = plan.token;
        uint256 planCost = plan.planCost;
        uint256 frequency = plan.frequency;
        uint256 referralPercentage = plan.referralPercentage;
        require(
            token.allowance(msg.sender, address(this)) >= planCost,
        );
        require(
            token.balanceOf(msg.sender) >= planCost,
        );
        require(
            subscriptions[msg.sender].isActive == false,
        );

        token.transferFrom(msg.sender, address(this), planCost);

        if (referral != address(0) && referral != msg.sender) {
            token.transferFrom(address(this), referral, (planCost * referralPercentage) / 100);
        }

        subscriptions[msg.sender].subscriber = msg.sender;
        subscriptions[msg.sender].start[planID] = block.timestamp;
        subscriptions[msg.sender].nextPayment[planID] = block.timestamp + frequency;
        subscriptions[msg.sender].isActive[planID] = true;
        subscriptions[msg.sender].userIDHash[planID] = userIDHash;

        userIDs[userIDHash] = msg.sender;
        addressToID[msg.sender] = userIDHash;
        numberToAddress[index] = msg.sender;
        index++;
        plans[planID].subscribers++;
        emit Subscribed(msg.sender, planID);
    }

    // cancel
    function cancel(uint256 planID) public {
        require(subscriptions[msg.sender].subscriber != address(0));
        require(subscriptions[msg.sender].subscriber[planID] == msg.sender);
        require(subscriptions[msg.sender].isActive[planID] == true);
        subscriptions[msg.sender].isActive[planID] = false;
        plans[planID].subscribers--;
        emit Canceled(msg.sender, planID);
    }

    // pay
    function pay(uint256 planID, address _subscriber) internal {
        Subscription storage subscription = subscriptions[_subscriber];
        Plan storage plan = plans[planID];

        IERC20 token = plan.token;
        uint256 planCost = plan.planCost;
        uint256 frequency = plan.frequency;

        require(
            token.allowance(_subscriber, address(this)) >= planCost,
        );
        require(
            subscription.subscriber != address(0) && subscription.subscriber == msg.sender,
        );
        require(
            subscription.nextPayment[planID] <= block.timestamp,
        );

        token.transferFrom(msg.sender, address(this), planCost);
        subscription.nextPayment[planID] = block.timestamp + frequency;
        emit Paid(msg.sender, planID);
    }

    // changeuserID
    function changeUserID(uint256 planID, bytes32 userIDHash) public {
        require(subscriptions[msg.sender].subscriber != address(0), "Subscriber does not exist");
        require(subscriptions[msg.sender].subscriber == msg.sender, "Sender is not the subscriber");
        require(userIDs[userIDHash] == address(0), "userIDHash is already in use");

        bytes32 oldUserIDHash = subscriptions[msg.sender].userIDHash[planID];
        userIDs[oldUserIDHash] = address(0);
        
        subscriptions[msg.sender].userIDHash[planID] = userIDHash;
        userIDs[userIDHash] = msg.sender;
        emit UserIDChanged(msg.sender, planID, oldUserIDHash, userIDHash);
    }


    // checkDue
    function checkDue(uint256 planID, address _subscriber) public view returns (bool) {
        Subscription storage subscription = subscriptions[_subscriber];
        Plan storage plan = plans[planID];
        require(_subscriber != address(0));
        return block.timestamp < subscription.nextPayment[planID] ? true : false;
    }


    // autoPay
    function autoPay(uint256 planID, address _subscriber) external {
        require(msg.sender == autoPayer);
        require(
            subscriptions[_subscriber].subscriber != address(0),
            "This subscription does not exist"
        );
        require(!checkDue(planID, _subscriber));
        pay(planID, _subscriber);
    }

    // withdraw
}
