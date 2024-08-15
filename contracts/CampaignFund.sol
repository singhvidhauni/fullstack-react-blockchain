// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFundFactory {
    address[] public deployedCampaignFunds;

    function createCampaign(uint minContributionInEther) public {
        uint minContribution = minContributionInEther * 1 ether;
        address newCampaignFund = address(
            new CampaignFund(minContribution, msg.sender)
        );
        deployedCampaignFunds.push(newCampaignFund);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaignFunds;
    }
}

contract CampaignFund {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        // mapping(address => bool) approvals;
    }

    event RequestCreated(string descripton, uint value, address recipient);
    event ContributionMade(address contributor, uint amount);
    event RequestApproved(uint requestId, address approver);
    event RequestFinalized(uint requestId);
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    //mapping(uint => Request) public requests;
    uint public numRequests;
    uint public approversCount;
    // This mapping tracks approvals for each request
    mapping(uint => mapping(address => bool)) public approvals;

    constructor(uint _minContribution, address _manager) {
        manager = _manager;
        //here the value recieved is converted to wei by multiplying with 10^18
        minContribution = _minContribution;
    }

    function contribute() public payable {
        require(
            msg.value >= minContribution,
            "The minimum contribution must be"
        );
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
        emit ContributionMade(msg.sender, msg.value);
    }

    function createRequest(
        string memory description,
        uint value,
        address recipient
    ) public adminOnly {
        require(recipient != address(0), "Invalid recipient address");
        require(
            value <= address(this).balance,
            "Request value exceeds contract balance"
        );
        Request storage newReq = requests.push();
        newReq.description = description;
        newReq.value = value;
        newReq.recipient = payable(recipient);
        newReq.complete = false;
        newReq.approvalCount = 0;
        numRequests++;
        emit RequestCreated(description, value, recipient);
    }

    // function approveRequest(uint index) public {
    //     Request storage request = requests[index];
    //     require(approvers[msg.sender]);
    //     require(!request.approvals[msg.sender]);
    //     request.approvals[msg.sender] = true;
    //     request.approvalCount++;
    // }
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender], "Only approvers can approve requests.");

        require(
            !approvals[index][msg.sender],
            "Request already approved by caller."
        );
        require(!request.complete, "Can't approve a complete request.");
        approvals[index][msg.sender] = true;
        request.approvalCount++;
        emit RequestApproved(index, msg.sender);
    }

    function finalizeRequest(uint index) public payable adminOnly {
        Request storage request = requests[index];
        require(
            request.approvalCount > (approversCount / 2),
            "Not Enough approvals."
        );
        require(!request.complete, "Request has already been finalized.");
        request.complete = true;
        address payable recipientAddress = request.recipient;
        recipientAddress.transfer(request.value);
    }

    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return numRequests;
    }

    function getRequest(
        uint index
    ) public view returns (string memory, uint, address, bool, uint) {
        Request storage request = requests[index];
        return (
            request.description,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount
        );
    }

    modifier adminOnly() {
        require(msg.sender == manager, "Only Manager can call this function.");
        _;
    }
}
