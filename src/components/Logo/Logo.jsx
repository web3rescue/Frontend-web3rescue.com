import styles from "./Logo.module.scss";

const Logo = ({ fontSize }) => {
  return (
    <span className={styles.container} style={{ fontSize }}>
      Web3Rescue
    </span>
  );
};

export default Logo;
