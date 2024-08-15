import Web3 from "web3";
let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  //this block will run in browser and it has a instance of metamask is running
  web3 = new Web3(window.ethereum);
  window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then(() => {
      console.log("Metamask access graded !");
    })
    .catch((err) => {
      console.log("Metamask access denied.", err.message);
    });
} else {
  //this block will run in server or the user is not running metamask
  /*const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `${process.env.NEXT_PUBLIC_SEPOLIA_END_POINT}${process.env.NEXT_PUBLIC_PROJECT_ID}`
    )
  );*/
  //for provider configuration using ganache-Cli
  //web3 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:8545`));
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      process.env.NEXT_PUBLIC_GANACHE_UI_RPC_END_POINT
    )
  );
  // web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_GANACHE_CLI_RPC_END_POINT));
}

export default web3;
