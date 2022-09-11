import clsx from "clsx";
import Card from "../Card/Card";
import styles from "./InputField.module.scss";

const InputField = ({
  classes = [],
  type,
  value,
  onChange,
  placeholder,
  label,
  id,
  icon,
  footer,
  ...rest
}) => {
  return (
    <div className={clsx(styles.container, ...classes)}>
      <label htmlFor={id}>{label}</label>
      <Card
        classes={[styles.inputContainer, icon ? styles.lessInputPadding : ""]}
        disabledPadding
        noMinHeight
      >
        {icon ? <span>{icon}</span> : null}
        {type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
          />
        ) : (
          <input
            id={id}
            value={value}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
          />
        )}
      </Card>
      {footer}
    </div>
  );
};

export default InputField;
