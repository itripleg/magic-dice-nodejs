# This code connects to a "dice game" that exists on the polygon mumbai ethereum testnet

This code creates an ethers ContractFactory using an abi and bytecode.
The ContractFactory can then be used to deploy the contract to target EVM blockchain
or create an instance of an already existing contract to be used as an interface.

from node.js REPL, use ```.load dice.js``` to create a connection to the blockchain and make available game functions.

once dice.js is loaded, the following commands are available.

```ethers```
>[ethers.js](https://docs.ethers.io/v5/) library

```wallet```
>ethers.js wallet already pre-configured with the private key loaded from .env.>local. Try ```wallet.address```

```provider```
>provider of the blockchain connection. For example, try
```provider.getBlock()``` to get the latest block mined on the network.

```contract```The actual instance of the smart contract. 
>Try ```contract.address``` to get the address of the (deployed) contract.

```owner```
>the address of the contract owner

```roll(lowBetNumber, highBetNumber, betAmount)```
>*constraints*
>
>- low bet must be greater than 10
>- high bet must be greater than or equal to low bet
>- high bet must be less than or equal to 100

```getRoll()```
>get the last (or current if in progress) roll

```getWinner()```
>get whether the last roll was a winning number

```getOwner()```
>get the address of the contract owner.

```getTotalRolls()```
>get how many times roll() has been called.