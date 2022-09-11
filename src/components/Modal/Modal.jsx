import React from "react";
import styles from "./Modal.module.scss";
import closeIcon from "../../assets/icons/close.svg";
import Card from "../Card/Card";
import { CircularProgress, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const Modal = ({ open, handleClose, children, title, classes, loading }) => {
  return (
    <Card
      classes={[styles.container, !open ? styles.modalClose : "", ...classes]}
      onClick={handleClose}
    >
      <div className={styles.main} onClick={(e) => e.stopPropagation()}>
        <header>
          <h6>{title}</h6>
          <IconButton onClick={handleClose}>
            {/* <img src={closeIcon} alt="close" /> */}
            <Close />
          </IconButton>
        </header>
        <hr />
        {loading ? (
          <div className={styles.loading}>
            <CircularProgress />
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};

export default Modal;
