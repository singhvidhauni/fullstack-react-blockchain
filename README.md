# dApp Solidity Crowdfunding Smart Contract
This repository contains a Solidity smart contract for a crowdfunding application. The smart contract allows users to create crowdfunding campaigns and allows contributors to fund these campaigns with Ether. 


## Features
Create Campaigns: Users can create crowdfunding campaigns by providing a minimum contribution amount required to become an approver.

Fund Campaigns: Contributors can send Ether to fund the campaigns they wish to support. Contributors become "approvers" once they contribute the minimum required amount.

Create Funding Requests: Campaign creators can create funding requests to specify how they plan to use the raised funds. Funding requests require approval from a majority of the campaign's contributors to be executed.

Approve Funding Requests: Approvers can vote on funding requests. A request needs more than 50% of approval votes to be executed.

Finalize Funding Requests: Once a funding request is approved, the campaign creator can finalize the request, and the funds will be transferred to the designated recipient.

## Development Environment
Truffle v5.10.2 (core: 5.10.2)
Ganache v7.8.0
Solidity - 0.8.20 (solc-js)
Node v18.12.1
Web3.js v1.10.0

## For React 

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

