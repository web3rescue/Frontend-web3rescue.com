import { Button, Card, Logo, Navbar } from "../../components/";
import styles from "./Home.module.scss";
import downArrowIcon from "../../assets/icons/down-arrow.svg";
import heroImg from "../../assets/hero.png";
import redirectArrowIcon from "../../assets/icons/redirect-arrow.svg";
import detailsIcon from "../../assets/icons/details.svg";
import transferIcon from "../../assets/icons/transfer.svg";
import payIcon from "../../assets/icons/pay.svg";
import { useRef, useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useNavigate } from "react-router-dom";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `none`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  background: "transparent",
  margin: "1rem 0",
  borderRadius: "5px",
  "&:before": {
    display: "none",
  },
  "& .Mui-expanded": {
    borderRadius: "5px 5px 0 0",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "white" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  WebkitBackdropFilter: "blur(10px)",
  backdropFilter: "blur(10px)",
  borderRadius: "5px",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  "& .Mui-expanded": {
    borderRadius: "5px 5px 0 0",
    p: {
      fontWeight: "600 !important",
      color: "var(--clr-primary-1)",
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  WebkitBackdropFilter: "blur(10px)",
  backdropFilter: "blur(10px)",
  borderRadius: "0 0 5px 5px",
}));

const Home = () => {
  const [expanded, setExpanded] = useState("panel0");

  const navigate = useNavigate();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const faqs = [
    {
      title: "How web3rescue.com helps against Sweeper Bot?",
      content:
        "We beat the sweeper bots via private transactions, they won't ever know how we save your assets.",
    },
    {
      title: "What all Assets can be rescued?",
      content:
        "Any ERC20 tokens that haven't left your wallet can be rescued, for any staked assets, reach out via chat for support.",
    },
    {
      title: "Why do I need to enter PrivateKey?",
      content:
        "We need the private keys to save your assets, but for your safety, we never even save it in our database. Check our open sourced code to see how it's all done.",
    },
    {
      title: "How much time does it take to rescue?",
      content:
        "We rescue your assets as fast as possible, max about 30-60 seconds.",
    },
    {
      title: "Whats the charge per rescue?",
      content:
        "We charge 0.1 ETH for any rescue amount, a small price to pay to save your assets.",
    },
  ];

  const howWeDoIt = useRef(null);

  function handleClickHowWeDoIt() {
    howWeDoIt.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.text}>
            {/* <h1>
              <Logo />
            </h1> */}
            <h2>
              Rescue your Ethereum Tokens and NFT's from Compromised accounts{" "}
            </h2>

            <div className={styles.navigate}>
              <img src={redirectArrowIcon} alt="arrow" />
              <div>
                <p>
                  Beat the sweeper bot on your account and rescue assets
                  Instantly
                </p>
                <div className={styles.btns}>
                  <Button onClick={() => navigate("/app/steps/1")}>
                    Get Started
                  </Button>
                  <div onClick={handleClickHowWeDoIt}>
                    <p>How we do it</p>
                    <img src={downArrowIcon} alt="how-its-done" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.images}>
            <img src={heroImg} alt="web3rescue" />
          </div>
        </section>
        <section
          id="how-it-works"
          className={styles.howContainer}
          ref={howWeDoIt}
        >
          <div className={styles.how}>
            <h4>
              How <Logo /> Works?
            </h4>
            <p>
              Making use of Flashbots MEV to rescue ERC20 Tokens ans NFT's to
              your address instantly!
            </p>
            <div className={styles.steps}>
              <div className={styles.card}>
                <span>1</span>
                <Card>
                  <img src={detailsIcon} alt="icon" />
                  <h5>Enter Details</h5>
                  <p>
                    Enter your compromised address details and asset to rescue
                  </p>
                </Card>
              </div>
              <div className={styles.card}>
                <span>2</span>
                <Card>
                  <img src={transferIcon} alt="icon" />
                  <h5>Sign Transaction</h5>
                  <p>
                    Manually signraw Transaction on frontend for that rescue
                    token
                  </p>
                </Card>
              </div>
              <div className={styles.card}>
                <span>3</span>
                <Card>
                  <img src={payIcon} alt="icon" />
                  <h5>Pay & Rescue</h5>
                  <p>Pay 0.1 ETH and Rescue asset Instantly</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.faq} id="faq">
          <h2>
            <span>F</span>requently <span>A</span>sked <span>Q</span>uestion
            <span>s</span>
          </h2>
          <div>
            <span className={styles.circle}></span>
            <span className={styles.circle}></span>
            <Card>
              {faqs.map((faq, i) => (
                <Accordion
                  expanded={expanded === "panel" + i}
                  onChange={handleChange("panel" + i)}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                  >
                    <Typography>{faq.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.content}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
