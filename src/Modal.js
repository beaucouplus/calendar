import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import FocusTrap from "focus-trap-react";
import useOnclickOutside from "react-cool-onclickoutside";
import { ModalButton } from "./Button";

function Modal({ children, showModal, onCloseModal }) {
  const modalContent = useRef();

  useOnclickOutside(modalContent, () => {
    onCloseModal();
  });

  return (
    <>
      {showModal ? (
        <ModalContent
          onCloseModal={onCloseModal}
          modalContentRef={modalContent}
        >
          {children}
        </ModalContent>
      ) : (
        <React.Fragment />
      )}
    </>
  );
}

function ModalContent({ children, onCloseModal, modalContentRef }) {
  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      onCloseModal();
    }
  };

  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        className="fixed top-0 left-0 w-screen h-screen flex items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        onKeyDown={onKeyDown}
      >
        <div
          ref={modalContentRef}
          className="static box-border top-0 right-0 h-screen w-1/2 max-w-1/2 bg-white border shadow-md"
        >
          <div className="w-full flex items-center justify-end flex-wrap pt-3 pr-3">
            <ModalButton
              callBack={() => onCloseModal()}
              ariaLabel="Close modal"
              ariaLabelledby="close-modal"
              autoFocus={true}
            >
              ✕
            </ModalButton>
          </div>

          <div className="h-full box-border overflow-auto flex flex-col justify-start">
            {children}
          </div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
}

export default Modal;
