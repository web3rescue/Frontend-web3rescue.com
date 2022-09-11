import styles from "./AppLayout.module.scss";
import { Navbar, Card } from "../../components";
import clsx from "clsx";
import tickIcon from "../../assets/icons/tick.svg";
import { LinearProgress } from "@mui/material";

const AppLayout = ({
  children,
  classes = [],
  step = 1,
  description,
  type = "ERC20",
  onChangeType,
  loading = false,
}) => {
  return (
    <>
      <Navbar />
      <main className={clsx(styles.main, ...classes)}>
        <div className={styles.left}>
          {step === 1 && (
            <div className={styles.switchType}>
              <div
                className={clsx(
                  styles.type,
                  type === "ERC20" ? styles.selected : ""
                )}
                onClick={() => onChangeType("ERC20")}
              >
                ERC20
              </div>
              <div
                className={clsx(
                  styles.type,
                  type === "NFT" ? styles.selected : ""
                )}
                onClick={() => onChangeType("NFT")}
              >
                NFT
              </div>
            </div>
          )}
          <div
            className={styles.stepper}
            style={{ marginTop: step > 1 ? "0" : "2rem" }}
          >
            <Card
              classes={[styles.card, getConnectorStyle(step)]}
              disabledPadding
            >
              <div className={getStyleFromStep(step, 1)}>
                <div>01</div>
                <div>
                  <p>STEP 1</p>
                  <h6>Enter Details</h6>
                  {step > 1 && (
                    <span>
                      Completed <img src={tickIcon} alt="complete" />
                    </span>
                  )}
                </div>
              </div>
              <div className={getStyleFromStep(step, 2)}>
                <div>02</div>
                <div>
                  <p>STEP 2</p>
                  <h6>Sign Transaction</h6>
                  {step > 2 && (
                    <span>
                      Completed <img src={tickIcon} alt="complete" />
                    </span>
                  )}
                </div>
              </div>
              <div className={getStyleFromStep(step, 3)}>
                <div>03</div>
                <div>
                  <p>STEP 3</p>
                  <h6>Pay & Rescue</h6>
                  {step > 3 && (
                    <span>
                      Completed <img src={tickIcon} alt="complete" />
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <h2>Step 0{step}</h2>
            <p>{description}</p>
          </div>
          <div className={styles.box}>
            {children}
            <span className={styles.loading}>
              {loading && <LinearProgress />}
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default AppLayout;

function getStyleFromStep(step, currentStep) {
  switch (currentStep) {
    case 1:
      return step > 1
        ? styles.completed
        : step === 1
        ? styles.active
        : styles.notVisited;
    case 2:
      return step > 2
        ? styles.completed
        : step === 2
        ? styles.active
        : styles.notVisited;
    case 3:
      return step > 3
        ? styles.completed
        : step === 3
        ? styles.active
        : styles.notVisited;
    default:
      return step > 1
        ? styles.completed
        : step === 1
        ? styles.active
        : styles.notVisited;
  }
}

function getConnectorStyle(step) {
  switch (step) {
    case 2:
      return styles.connector1;
    case 3:
      return styles.connector2;
    default:
      return styles.connector;
  }
}
