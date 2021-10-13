// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Committee{

    event newCommittee(uint256 committeeId, string name, uint balance, address stakeholder, uint256 submitAmount);
    event amountWithdrawed(address stakeholder, uint balance);

    struct CommitteeStruct{
        string name;
        uint balance;
        address stakeholder;
        uint256 submitAmount;
        address[] participants;
        mapping(address => bool) approvals;
    }

    uint256 numCommittees;
    mapping(uint256 => CommitteeStruct) public committees;


    function createCommittee(string memory name, address stakeholder, uint256 submitAmount) payable public {

        CommitteeStruct storage committee  = committees[numCommittees++];
        committee.name = name;
        committee.balance = msg.value;
        committee.stakeholder = stakeholder;
        committee.submitAmount = submitAmount;
        committee.approvals[msg.sender] = false;

        committee.participants.push(stakeholder);
        committee.approvals[stakeholder] = true;
        emit newCommittee(numCommittees-1, name, msg.value, stakeholder, submitAmount);
    }

    function joinCommittee(uint256 committeeId) payable public {

        require(msg.value == committees[committeeId].submitAmount, "Amount not equal to the required amount!");
        committees[committeeId].participants.push(msg.sender);
        committees[committeeId].approvals[msg.sender] = false;

        if(msg.sender != committees[committeeId].stakeholder){
            committees[committeeId].balance += msg.value;
        }

    }

    function approveWithdrawal(uint256 committeeId) public {
        require(!committees[committeeId].approvals[msg.sender]);
        committees[committeeId].approvals[msg.sender] = true;
    }

    function withdraw(uint256 committeeId) public {
        require(msg.sender == committees[committeeId].stakeholder,  "You are not allowed to withdraw money!");
        require(committees[committeeId].balance > 0, "Insufficient balance!");
        bool check = true;

        for(uint256 i = 0; i < committees[committeeId].participants.length; i++){
            address participant = committees[committeeId].participants[i];
            if(!committees[committeeId].approvals[participant]) check = false;
        }

        require(check, "All participants haven't yet approved withdrawal");

        uint balance = committees[committeeId].balance;
        committees[committeeId].balance = 0;
        payable(msg.sender).transfer(balance);

        emit amountWithdrawed(msg.sender, balance);
    }


}