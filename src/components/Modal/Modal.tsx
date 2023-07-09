import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

interface Props {
  children: React.ReactNode;
}

const modalRoot = document.getElementById("modal-root");

const el = document.createElement("div");

const Modal = (props: Props) => {
  useEffect(() => {
    modalRoot?.appendChild(el);

    return () => {
      modalRoot?.removeChild(el);
    }
  }, []);

  return ReactDOM.createPortal(props.children, el);
}

export default Modal;
