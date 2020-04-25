import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { OutlineButton } from "./Button";

function Modal({ children, showModal, onCloseModal }) {
  return (
    <>
      {showModal ? (
        <ModalContent onCloseModal={onCloseModal}>{children}</ModalContent>
      ) : (
        <React.Fragment />
      )}
    </>
  );
}

function ModalContent({ children, onCloseModal }) {
  return ReactDOM.createPortal(
    <aside
      className="fixed top-0 left-0 w-screen h-screen flex items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div className="static box-border top-0 right-0 h-screen w-1/2 max-w-xl p-2 bg-white border shadow-md">
        <div className="w-full flex items-center justify-end flex-wrap p-1">
          <OutlineButton callBack={() => onCloseModal()}>✕</OutlineButton>
        </div>

        <div className="h-full box-border overflow-auto flex flex-col justify-start mx-2 px-1 pt-1 pb-5">
          {children}
        </div>
      </div>
    </aside>,
    document.body
  );
}
export default Modal;
