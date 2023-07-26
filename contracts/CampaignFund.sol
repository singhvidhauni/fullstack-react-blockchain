// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFund {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    //Request[] public requests;
    mapping(uint => Request) public requests;
    uint numRequests;
    uint public approversCount;

    constructor(uint _minContribution) {
        manager = msg.sender;
        //here the value recieved is converted to wei by multiplying with 10^18
        minContribution = (_minContribution) * (10 ** 18);
    }

    function contribute() public payable {
        require(msg.value >= minContribution,'The minimum contribution must be');
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public adminOnly {
        Request storage newReq = requests[numRequests++];
        newReq.description = description;
        newReq.value = value;
        newReq.recipient = payable(recipient);
        newReq.complete = false;
        newReq.approvalCount = 0;
        newReq.approvals[recipient] = false;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable adminOnly {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2), "Not Enough approvals.");
        require(!request.complete, "Request has already been finalized.");
        request.complete = true;
        address payable recipientAddress = request.recipient;
        recipientAddress.transfer(request.value);
    }

    modifier adminOnly() {
        require(msg.sender == manager,'Only admin has access Rights to create requests');
        _;
    }
}