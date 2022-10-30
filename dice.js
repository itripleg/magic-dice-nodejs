// This code creates an ethers ContractFactory using an abi and bytecode.
// The ContractFactory can then be used to deploy the contract to target EVM blockchain
// or create an instance of an already existing contract to be used as an interface.

//method parse .env.local values into strings
// require("dotenv").config({
//   path: require("find-config")(".env.local"),
// });
require("dotenv").config();

const ethers = require("ethers");

//main connection to our target blockchain
// we can use different endpoints for different networks, e.g. mainnet/testnet
const provider = new ethers.providers.JsonRpcProvider(
  process.env.JSON_RPC_ENDPOINT
);

//  We need 2-3 things to instantiate our factory: abi, bytecode, [signer].
const abi =
  require(`./contracts/artifacts/${process.env.CONTRACT_NAME}_metadata.json`)
    .output.abi;

const bytecode =
  require(`./contracts/artifacts/${process.env.CONTRACT_NAME}.json`).data
    .bytecode;

//DO NOT INCLUDE WALLET PRIVATE KEY IN PRODUCTION.
if (!process.env.WALLET_PRIVATE_KEY) {
  console.log("WALLET_PRIVATE_KEY not defined!");
  process.exit();
}

//ethers <Wallet> to be used as our signer
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

// lets build the factory! 👷🏾‍♂️
const factory = new ethers.ContractFactory(abi, bytecode, wallet);

// factory can now optionally deploy its smart contract to target JSON_RPC_ENDPOINT 🚀
// factory.deploy()

// or we can connect to an already existing contract address
const contract = factory.attach(process.env.CONTRACT_ADDRESS);

// interact with contract by using *async* calls i.e. `contract.<function>`

// get previous or current roll result
async function getRoll() {
  contract
    .rollResult()
    .then((res) => {
      if (parseInt(res) === 777) {
        console.log(parseInt(res), "roll in progress...");
      } else console.log(parseInt(res));
    })
    .catch((e) => {
      console.log("error occurred: ");
    });
}

//roll the dice 🎲
async function roll(_lowBet, _highBet, _amount) {
  await contract.roll(_lowBet, _highBet, _amount);
}

//owner of the contract
function getOwner() {
  const owner = contract.owner();
  return owner;
}

async function getWinner() {
  (await contract.winner())
    ? console.log(`last roll was a winner!!`)
    : console.log(`last roll was a loser...`);
}

//total number of times roll function has been called
async function getTotalRolls() {
  await contract.totalRolls().then((res) => console.log(parseInt(res)));
  // This line does the same thing
  // let total = console.log(parseInt(await contract.totalRolls()));
}

let owner = await contract.owner();

let testRoll = async () => {
  console.log("await roll(23, 73, 666);");
  await roll(23, 73, 666);
};

// buy in of 1 is the minium
async function buyIn(amount) {
  await contract.buyIn({
    value: String(ethers.utils.parseUnits(String(amount * 0.001)), "finney"),
  });
  console.log(
    "check your balance after a moment before trying to buy in again"
  );
}

// returns main token balance (mumbai polygon in this case) and DICEPOINTS
function balance() {
  provider.getBalance(wallet.address).then((res) => {
    console.log("Native token balance:", ethers.utils.formatEther(res));
  });
  contract.balanceOf(wallet.address, 0).then((res) => {
    console.log(
      "DICEPOINTS balance",
      parseInt(ethers.utils.formatUnits(String(res), "finney"))
    );
  });
  return "balance of " + wallet.address;
}

process.stdout.write("\033c");
process.stdout.write("\r\n Welcome to Magic Dice! \n");
process.stdout.write("\r\n Lets get your balance...\n");
balance();
