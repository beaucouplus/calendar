import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ModalButton } from "./Button";
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
  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      onCloseModal();
    }
  };

  return ReactDOM.createPortal(
    <aside
      className="fixed top-0 left-0 w-screen h-screen flex items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      onKeyDown={onKeyDown}
    >
      <div className="static box-border top-0 right-0 h-screen w-3/4 max-w-3/4 p-2 bg-white border shadow-md">
        <div className="w-full flex items-center justify-end flex-wrap p-1">
          <ModalButton
            callBack={() => onCloseModal()}
            ariaLabel="Close modal"
            ariaLabelledby="close-modal"
            autoFocus={true}
          >
            ✕
          </ModalButton>
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
