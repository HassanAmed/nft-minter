/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
  getConnectedChainId
} from "./utils/interact.js";

const InvalidNetworkModal = ({ showErrorModal }) => (
  <Modal
    show={showErrorModal}
    onHide={() => { }}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header>
      <Modal.Title>Invalid Network</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <span style={{ color: 'red' }}>
        Please select Ploygon Mainnet from Metamast Network Collection in order to proceed further.
      </span>
    </Modal.Body>
  </Modal>
)

const UniSwapIframe = ({ isUniSwapIframe, setUniSwapIframeState }) => (
  <Modal
    show={isUniSwapIframe}
    onHide={() => setUniSwapIframeState(false)}
    backdrop="static"
    keyboard={false}
    size="lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>Swap Tokens</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <iframe
        src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f"
        height="660px"
        width="100%"
        title="uniswap-iframe"
        style={{
          border: "0",
          margin: '0 auto',
          marginBottom: ".5rem",
          display: "block",
          borderRadius: "10px",
          maxWidth: "960px",
          minWidth: "300px"
        }}
      />
    </Modal.Body>
  </Modal>
)

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [isInvalidNetwork, setNetworkState] = useState(false);
  const [isUniSwapIframe, setUniSwapIframeState] = useState(false);

  function addWalletListener() {
    window.ethereum.on("chainChanged", (_chainId) => window.location.reload());
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Enter amount of NUGFT to mint.");
          checkIfValidNetwork();
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
    checkIfValidNetwork();
  }, []);

  const checkIfValidNetwork = async () => {
    const chainId = await getConnectedChainId();
    if (chainId !== "0x89" && !isInvalidNetwork) setNetworkState(true);
    else if (chainId === "0x89" && isInvalidNetwork) setNetworkState(false);
  }

  const connectWalletPressed = async () => {
    if (isInvalidNetwork) return;
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    if (isInvalidNetwork) return;
    setLoading(true);
    const { status } = await mintNFT(amount);
    setStatus(status);
    setLoading(false);
  };

  return (
    <>
      <div className="Minter">
        <button id="walletButton" disabled={isInvalidNetwork} onClick={connectWalletPressed}>
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
            disabled={isInvalidNetwork}
          />
          {/* <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. A cool description for your asset"
          onChange={(event) => setDescription(event.target.value)}
        /> */}
        </form>
        <div className="mintActionsContainer">
          <button id="mintButton" disabled={isInvalidNetwork} onClick={onMintPressed}>
            {loading ? "Minting" : "Mint NUGFT"}
          </button>
          <button id="uniswapButton" disabled={isInvalidNetwork} onClick={() => setUniSwapIframeState(true)}>
            Swap Tokens
          </button>
        </div>
        <p id="status">{status}</p>
      </div>
      <InvalidNetworkModal showErrorModal={isInvalidNetwork} />
      <UniSwapIframe isUniSwapIframe={isUniSwapIframe} setUniSwapIframeState={setUniSwapIframeState} />
    </>
  );
};

export default Minter;
