/* eslint-disable react/jsx-no-target-blank */
require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x2cb63c79522B69f59919aa4891d636b998FeF9Aa";

export const mintNFT = async (amount) => {
  //error handling
  if (amount > 5 || amount < 1) {
    return {
      success: false,
      status: "❗ Mint amount should be between 1 - 5.",
    };
  }
  const cost = getCostInHex(amount);
  //load smart contract
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress,
    gas: "4C4B40",
    // gasPrice: '0x9184e72a000', use metamask suggested
    value: cost,
    data: window.contract.methods.mint(amount).encodeABI(), //make call to NFT smart contract
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      success: true,
      status: `Check out your transaction on Polygonscan: https://polygonscan.com/tx/${txHash}`,
    };
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message,
    };
  }
};

function getCostInHex(amount) {
  let costInMatic = amount * 75;
  let costInWei = web3.utils.toWei(String(costInMatic));
  return web3.utils.toHex(costInWei);
}

export const getTotalSupply = async () => {
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const ts = await window.contract.methods
    .totalSupply()
    .call({ from: window.ethereum.selectedAddress });
  return ts;
};

export const getConnectedChainId = async () => {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  return chainId;
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter amount of NUGFT to mint.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Enter amount of NUGFT to mint.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};
