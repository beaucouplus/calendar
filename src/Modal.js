import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "./Button";
function Modal() {
  const [isShown, setIsShown] = useState(false);
  const triggerText = "prout";

  useEffect(() => console.log(isShown));

  function openModal() {
    setIsShown(true);
  }

  function closeModal() {
    setIsShown(false);
  }
  return (
    <>
      <ModalTrigger triggerText={triggerText} onShowModal={() => openModal()} />
      ;
      {isShown ? (
        <ModalContent onCloseModal={() => closeModal()} />
      ) : (
        <React.Fragment />
      )}
    </>
  );
}

function ModalTrigger({ triggerText, onShowModal }) {
  return (
    <button className="" onClick={onShowModal}>
      {triggerText}
    </button>
  );
}

function ModalContent({ onCloseModal }) {
  return ReactDOM.createPortal(
    <aside className="absolute top-0 left-0 bg-transparent w-screen h-screen flex items-center">
      <div className="bg-white top-50 left-50 max-w-sm mx-auto z-40 p-2">
        <div className="w-full">
          <Button callBack={onCloseModal}>Close</Button>
        </div>

        <div className="modal-body">Show me something</div>
      </div>
    </aside>,
    document.body
  );
}
export default Modal;
