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
      <div className="bg-white top-50 left-50 w-1/3 max-w-lg mx-auto p-2 shadow-md border rounded-lg">
        <div className="w-full flex items-center justify-end flex-wrap p-1">
          <OutlineButton callBack={() => onCloseModal()}>✕</OutlineButton>
        </div>

        <div className="mx-2 px-1 pt-1 pb-12">{children}</div>
      </div>
    </aside>,
    document.body
  );
}
export default Modal;
