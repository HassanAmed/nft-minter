/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./utils/interact.js";

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  function addWalletListener() {
    window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Enter amount of NUGFT to mint.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    setLoading(true);
    const { status } = await mintNFT(amount);
    setStatus(status);
    setLoading(false);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🚀 NUGFT Minter</h1>
      <p>
        5000 Unique NUGFTs (80 MATIC / NUGFT)."
      </p>
      <form>
        <h2>Amount: </h2>
        <input
          type="number"
          min="1" max="5"
          placeholder="amount of nugfts to mint between 1 - 5"
          onChange={(event) => setAmount(event.target.value)}
        />
        {/* <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. A cool description for your asset"
          onChange={(event) => setDescription(event.target.value)}
        /> */}
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        {loading ? "Minting" : "Mint NUGFT"}
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
