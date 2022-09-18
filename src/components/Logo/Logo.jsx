import styles from "./Logo.module.scss";
import logoIcon from "../../assets/logo.png";

const Logo = ({ fontSize }) => {
  return (
    <span className={styles.container} style={{ fontSize }}>
      <img src={logoIcon} alt="Web3Rescue" height="auto" width="100px"></img>
    </span>
  );
};

export default Logo;
