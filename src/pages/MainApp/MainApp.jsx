import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "../../components";
import InputField from "../../components/InputField/InputField";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { GlobalContext } from "../../utils/contexts/GlobalContext";
import styles from "./MainApp.module.scss";
import ethIcon from "../../assets/icons/eth.svg";
import downIcon from "../../assets/icons/down.svg";
import { useNavigate, useParams } from "react-router-dom";
import keyIcon from "../../assets/icons/key.svg";
import flameIcon from "../../assets/icons/flame.svg";
import copyIcon from "../../assets/icons/copy.svg";
import checkIcon from "../../assets/icons/check.svg";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { copyToClipboard, debounceSearch } from "../../utils";
import Modal from "../../components/Modal/Modal";
import { decodeToken } from "react-jwt";
import axios from "axios";
import { SearchOutlined } from "@mui/icons-material";

const MainApp = () => {
  const { tokenType, setTokenType } = useContext(GlobalContext);

  const { step } = useParams();
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarStatus, setSnackBarStatus] = useState("success");

  const navigate = useNavigate();

  console.log({ step });
  function onSubmit(e) {
    setLoading(true);
    e.preventDefault();
    setTimeout(() => {
      if (step <= 2) {
        navigate(`/app/steps/${parseInt(step) + 1}`);
      }
      setLoading(false);
    }, 500);
  }

  function showAlert(message, status) {
    setSnackBarMessage(message);
    setSnackBarStatus(status);
    setOpenSnackBar(true);
  }

  function handleCloseSnackbar() {
    setOpenSnackBar(false);
    setTimeout(() => {
      setSnackBarMessage("");
      setSnackBarStatus("success");
    }, 100);
  }

  return (
    <AppLayout
      step={parseInt(step)}
      type={tokenType}
      description="Submit info so we can generate a rescue transaction data for rescue."
      onChangeType={setTokenType}
      classes={styles.container}
      loading={loading}
    >
      {step === "1" ? (
        <Step1
          handleSubmit={onSubmit}
          setLoading={setLoading}
          showAlert={showAlert}
        />
      ) : step === "2" ? (
        <Step2
          handleSubmit={onSubmit}
          setLoading={setLoading}
          showAlert={showAlert}
        />
      ) : (
        <Step3
          handleSubmit={onSubmit}
          setLoading={setLoading}
          showAlert={showAlert}
        />
      )}
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarStatus}
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default MainApp;

const Step1 = ({ setLoading, showAlert }) => {
  const [selected, setSelected] = useState(ethIcon);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  // const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const navigate = useNavigate();

  const {
    tokenType,
    fetchTokenList,
    fetchTokenListNFT,
    setTokenId,
    setContractAddress,
    fetchTransactionData,
    setRawTransaction,
    contractAddress,
    walletAddress,
    setWalletAddress,
    safeAddress,
    setSafeAddress,
  } = useContext(GlobalContext);

  useEffect(() => {
    setContractAddress("");
    setSelected(null);
  }, [setContractAddress, tokenType]);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Clicked");
    setLoading(true);
    try {
      const res = await fetchTransactionData();
      console.log({ res });
      setRawTransaction(res.data);
      setLoading(false);
      navigate(`/app/steps/2`);
    } catch (error) {
      setLoading(false);
      console.log({ error });
      showAlert("Error: " + error.response?.data?.message, "error");
    }
  }

  async function fetchTokens() {
    if (!walletAddress) {
      return showAlert("Enter Wallet Address", "info");
    }
    setLoadingModal(true);
    if (tokenType === "ERC20") {
      const res = await fetchTokenList();
      console.log({ res });
      let tempData = res.data.result.assets
        ?.filter((item) => item.tokenSymbol !== "ETH")
        .map((item) => ({
          ...item,
          balanceUsd: `$${Number(item.balanceUsd).toFixed(2)}`,
        }));
      setData(tempData);
      setSearchData(tempData);
    } else {
      const res = await fetchTokenListNFT();
      let tempData = res.data.assets
        ?.filter((item) => !item?.collection?.name?.includes("ENS"))
        .map((item) => ({
          ...item,
          thumbnail: item.image_thumbnail_url,
          contractAddress: item.asset_contract.address,
        }));
      setData(tempData);
      setSearchData(tempData);
    }
    setLoadingModal(false);
  }

  function onClickToken(item) {
    setSelected(item.thumbnail);
    setContractAddress(item.contractAddress);
    setTokenId(item.token_id);
    setModalOpen(false);
  }

  function handleSearch(value) {
    setSearchData(
      data.filter(
        (item) =>
          item[item.tokenSymbol ? "tokenSymbol" : "name"]
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          (item.tokenName
            ? item.tokenName?.toLowerCase().includes(value.toLowerCase())
            : item.collection?.name
                ?.toLowerCase()
                .includes(value.toLowerCase()))
      )
    );
  }

  return (
    <>
      <h4>Enter Details</h4>
      <form onSubmit={handleSubmit}>
        <InputField
          id="walletAddress"
          label="Enter your compromised wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          classes={[styles.input]}
          required
        />
        <div
          className={styles.select}
          onClick={() => {
            if (!walletAddress) {
              document.getElementById("walletAddress").focus();
              return showAlert("Wallet Address is required", "info");
            }
            setModalOpen(true);
            fetchTokens();
          }}
        >
          {tokenType === "ERC20" && selected === null ? (
            <h5>Select Token</h5>
          ) : selected !== null ? (
            <img src={selected} alt="selected" />
          ) : (
            <h5>Select NFT</h5>
          )}
          {contractAddress && (
            <span>
              {contractAddress?.slice(0, 5)}...
              {contractAddress?.slice(
                contractAddress?.length - 5,
                contractAddress?.length
              )}
            </span>
          )}
          <img src={downIcon} alt="more" />
        </div>
        <InputField
          label="Enter your safe wallet address"
          value={safeAddress}
          onChange={(e) => setSafeAddress(e.target.value)}
          classes={[styles.input]}
          required
        />
        <div className={styles.flexRow}>
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <Modal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title="Select a contract"
        classes={[styles.modal]}
        loading={loadingModal}
      >
        <div className={styles.search}>
          <InputField
            placeholder="Search Here"
            // value={search}
            onChange={debounceSearch(handleSearch, 300)}
            classes={[styles.input]}
            required
            icon={
              <SearchOutlined htmlColor="grey" style={{ marginTop: "5px" }} />
            }
          />
        </div>
        <div className={styles.list}>
          {walletAddress ? (
            searchData?.map((item, i) => (
              <div
                key={i}
                className={styles.listItem}
                onClick={() => onClickToken(item)}
              >
                <div>
                  <img src={item.thumbnail || item.logo} alt="token" />
                  <div className={styles.tokenDescription}>
                    <h5>{item.tokenSymbol ?? item.name}</h5>
                    <p>{item.tokenName ?? item.collection.name}</p>
                  </div>
                  {tokenType === "ERC20" ? (
                    <p>{item.balanceUsd}</p>
                  ) : (
                    <Tooltip title="Click to copy" placement="top">
                      <p
                        className={!item.balanceUsd ? styles.copyId : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.token_id, () =>
                            showAlert("Copied to clipboard", "success")
                          );
                        }}
                      >
                        {item.token_id}
                      </p>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))
          ) : (
            <span style={{ color: "black" }}>
              Please Enter a wallet address
            </span>
          )}
        </div>
      </Modal>
    </>
  );
};

const Step2 = ({ setLoading, showAlert }) => {
  const [privateKey, setPrivateKey] = useState("");

  const navigate = useNavigate();

  const {
    safeAddress,
    walletAddress,
    rawTransaction,
    signTransaction,
    initiateRescue,
    signedTransaction,
    setSignedTransaction,
    setDecodedToken,
    resetSignedTransaction,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!safeAddress || !walletAddress) {
      navigate(`/app/steps/1`);
    }
    setPrivateKey("");
    resetSignedTransaction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, walletAddress, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    signTransaction(rawTransaction, privateKey, (signed) => {
      setSignedTransaction(signed[0]);
      setLoading(false);
      showAlert("Transaction Signed", "success");
      setPrivateKey("");
    });
  }

  async function onClickNext() {
    setLoading(true);
    const res = await initiateRescue(signedTransaction);
    const decoded = decodeToken(res.data.rescueToken);
    localStorage.setItem("rescueToken", res.data.rescueToken);
    console.log({ decoded });
    setDecodedToken(decoded);
    setLoading(false);
    navigate(`/app/steps/3`);
  }

  return (
    <>
      <h4>Sign the raw Transaction</h4>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Card
          classes={[
            styles.rawTransaction,
            signedTransaction ? styles.collapse : "",
          ]}
        >
          <p>Raw Txn</p>
          {/* <JSONPretty id="json-pretty" data={rawTransaction}></JSONPretty> */}
          {Object.entries(rawTransaction).map(([key, value]) => (
            <p key={key}>
              <span>{key}</span> ={" "}
              <span>
                {Object.values(value)?.length ? JSON.stringify(value) : value}
              </span>
            </p>
          ))}
        </Card>
        <InputField
          id="privateKey"
          name="privateKey"
          label="Enter your private key"
          required
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          classes={[styles.input]}
          disabled={Boolean(signedTransaction)}
          type="password"
          icon={<img src={keyIcon} alt="key" />}
          autoComplete="new-password"
          footer={
            <span className={styles.note}>
              Note: We do not store/share your private keys
            </span>
          }
        />
        {!signedTransaction && (
          <div className={styles.flexRow}>
            <Button type="submit">Sign Transaction</Button>
          </div>
        )}

        {signedTransaction && (
          <Card classes={[styles.signedTransaction]}>
            <p>
              <span>Signed Txn = </span> {signedTransaction}
            </p>
          </Card>
        )}
        {signedTransaction && (
          <div className={styles.flexRow}>
            <Button onClick={onClickNext}>Next</Button>
          </div>
        )}
      </form>
    </>
  );
};

const Step3 = ({ setLoading, showAlert }) => {
  const [paymentAddress, setPaymentAddress] = useState("");
  const [gasFees, setGasFees] = useState(0.1);
  const [isCopied, setIsCopied] = useState(false);
  const [isSumulating, setIsSimulating] = useState(false);
  const [isSimulationSuccessful, setIsSimulationSuccessful] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isRescued, setIsRescued] = useState(false);

  const { signedTransaction, decodedToken, submitRescue } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!signedTransaction || !decodedToken) {
      navigate(`/app/steps/1`);
    } else {
      setGasFees(0.1);
      // setPaymentAddress(`${decodedToken.paymentID}`);
    }
  }, [signedTransaction, decodedToken, navigate]);

  function handleAfterCopy() {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  let paymentTimer;

  async function checkPayment() {
    const res = await axios.get(
      `https://sideshift.ai/api/v1/orders/${decodedToken.paymentID}`
    );
    if (res.data.deposits?.length) {
      setIsWaitingForPayment(false);
      setIsPaymentSuccessful(true);
      clearInterval(paymentTimer);
      setLoading(false);
    }
  }

  async function handleClickPayRescue() {
    if (isSumulating || isWaitingForPayment) return;

    // onclick -> Resce Now
    if (isPaymentSuccessful) {
      setLoading(true);
      const res = await submitRescue(true);
      if (res.data.success === true) {
        showAlert("🎉 Congratulation your Asset is transfered to Safe Address", "success");
        setIsRescued(true);
      } else {
        showAlert("Transaction Pickup failed! Try Rescue Now again", "error");
      }
      setLoading(false);
    }

    setLoading(true);
    if (!isSimulationSuccessful) {
      setIsSimulating(true);
      const res = await submitRescue(false);
      if (res.data.success) {
        setIsSimulationSuccessful(true);
        showAlert("Simulation Successful", "success");
      } else {
        showAlert("Simulation Failed", "error");
      }
      console.log({ res });
      setIsSimulating(false);
      console.log({ decodedToken });
      const paymentInfo = await axios.get(
        `https://sideshift.ai/api/v1/orders/${decodedToken.paymentID}`
      );
      console.log({ paymentInfo });
      setPaymentAddress(paymentInfo.data.depositAddress.address);
      setLoading(false);
    } else {
      setLoading(true);
      setIsWaitingForPayment(true);
      paymentTimer = setInterval(() => {
        checkPayment();
      }, 3000);
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h4>
          {isSimulationSuccessful
            ? "Payment includes the gas fees"
            : "Simulate the transaction"}
        </h4>
        {isSimulationSuccessful && (
          <div className={styles.gas}>
            <img src={flameIcon} alt="gas" />
            <p>{gasFees} ETH</p>
          </div>
        )}
        {!isSimulationSuccessful && (
          <div className={styles.flexRow}>
            <Button onClick={handleClickPayRescue}>Start Simulation</Button>
          </div>
        )}
      </div>
      {isSimulationSuccessful && (
        <>
          <div className={styles.paymentAddress}>
            <span>{paymentAddress}</span>
            <IconButton
              onClick={() =>
                !isCopied
                  ? copyToClipboard(paymentAddress, handleAfterCopy)
                  : {}
              }
            >
              <img src={!isCopied ? copyIcon : checkIcon} alt="copy" />
            </IconButton>
          </div>
          <span className={styles.note}>
            Note: Pay the gas fees to above address to secure the wallet
          </span>
        </>
      )}
      &nbsp;
      {isSimulationSuccessful && (
        <div className={styles.flexRow}>
          <Button
            disabled={isWaitingForPayment || isSumulating || isRescued}
            onClick={handleClickPayRescue}
          >
            {isWaitingForPayment
              ? "Waiting for payment..."
              : isPaymentSuccessful
              ? "Rescue Now"
              : "Pay & Rescue"}
          </Button>
        </div>
      )}
    </>
  );
};
