import clsx from "clsx";
import styles from "./Card.module.scss";

const Card = ({
  children,
  disabledPadding = false,
  classes = [],
  noMinHeight = false,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        styles.container,
        disabledPadding ? styles.disablePadding : "",
        noMinHeight ? styles.noMinHeight : "",
        ...classes
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
