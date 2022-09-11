import { createContext, useState } from "react";
import { API_MULTICHAIN, API_RESCUE } from "../api";
import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import axios from "axios";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }) => {
  const [tokenType, setTokenType] = useState("ERC20");
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [rawTransaction, setRawTransaction] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [safeAddress, setSafeAddress] = useState("");
  const [signedTransaction, setSignedTransaction] = useState();
  const [decodedToken, setDecodedToken] = useState({});

  async function fetchTokenList() {
    return await API_MULTICHAIN.post("/multichain", {
      jsonrpc: "2.0",
      method: "ankr_getAccountBalance",
      params: {
        blockchain: "eth",
        walletAddress,
      },
      id: 1,
    });
  }

  async function fetchTokenListNFT() {
    return await axios.get(
      `https://api.opensea.io/api/v1/assets?owner=${walletAddress}&order_direction=desc&limit=20&include_orders=false`,
      {
        headers: {
          "X-API-KEY": "40e4ba51dfb94a9489fdc848b1180d93",
        },
      }
    );
  }

  async function fetchTransactionData() {
    let data = {
      userwalletaddress: walletAddress,
      contractaddress: contractAddress,
      safeAddress,
      // type: tokenType.toLowerCase(),
    };
    console.log({ safeAddress });
    console.log({ tokenType });
    if (tokenType === "NFT") {
      data.tokenID = tokenId;
      data.type = "nft";
    }
    console.log({ data });
    return await API_RESCUE.post(`/fetch-transactiondata`, data);
  }

  async function signTransaction(rawTransaction, privateKey, cb) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/eth"
      );
      console.log({ privateKey });
      const compromisedwallet = new ethers.Wallet(privateKey, provider);
      const authSigner = new ethers.Wallet(
        "0x2000000000000000000000000000000000000000000000000000000000000000"
      );
      const flashbotProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        "https://relay.flashbots.net"
      );
      const signedTxBundle = await flashbotProvider.signBundle([
        {
          signer: compromisedwallet,
          transaction: rawTransaction,
        },
      ]);
      cb(signedTxBundle);
    } catch (err) {
      console.log("Sign error:", err.message);
    }
  }

  async function initiateRescue(signedTransaction) {
    let data = {
      userwalletaddress: walletAddress,
      contractaddress: contractAddress,
      safeAddress,
      signedTransaction,
    };
    if (tokenId) {
      data.tokenID = parseInt(tokenId);
      data.type = "nft";
    }
    return await API_RESCUE.post(`/initiate-rescue`, data);
  }

  async function submitRescue(consent = false) {
    return await API_RESCUE.post(
      `/submit-rescue?consent=${consent}`,
      {
        userwalletaddress: walletAddress,
        contractaddress: contractAddress,
        safeAddress,
        signedTransaction,
        tokenID: tokenId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rescueToken")}`,
        },
      }
    );
  }

  function resetSignedTransaction() {
    setSignedTransaction();
  }

  return (
    <GlobalContext.Provider
      value={{
        tokenType,
        setTokenType,
        contractAddress,
        walletAddress,
        setWalletAddress,
        safeAddress,
        setSafeAddress,
        setContractAddress,
        rawTransaction,
        signTransaction,
        signedTransaction,
        setSignedTransaction,
        setRawTransaction,
        decodedToken,
        setDecodedToken,
        setTokenId,
        fetchTokenList,
        fetchTransactionData,
        initiateRescue,
        submitRescue,
        fetchTokenListNFT,
        resetSignedTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
