import styles from "./Button.module.scss";

const Button = ({ children, onClick, type, ...rest }) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      {...rest}
      className={styles.btn}
    >
      {children}
    </button>
  );
};

export default Button;
