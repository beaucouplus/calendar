import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import { OutlineButton } from "./Button";
const ModalContext = React.createContext();

function ModalStore({ children }) {
  const [isShown, setIsShown] = useState(false);
  const [modalContent, setModalContent] = useState("default message");

  function openModal(content) {
    setIsShown(true);
    setModalContent(content);
  }

  function closeModal() {
    setIsShown(false);
  }
  return (
    <ModalContext.Provider
      value={{
        isShown: isShown,
        onShowModal: openModal,
        onCloseModal: closeModal,
        modalContent: modalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

function Modal({ children }) {
  const { isShown, onCloseModal, modalContent } = useContext(ModalContext);

  return (
    <>
      {children}
      {isShown ? (
        <ModalContent content={modalContent} onCloseModal={onCloseModal} />
      ) : (
        <React.Fragment />
      )}
    </>
  );
}

function ModalContent({ content, onCloseModal }) {
  return ReactDOM.createPortal(
    <aside className="absolute top-0 left-0 bg-transparent w-screen h-screen flex items-center">
      <div className="bg-white top-50 left-50 w-1/3 max-w-lg mx-auto p-2 shadow-lg">
        <div className="w-full flex items-center justify-end flex-wrap">
          <OutlineButton callBack={onCloseModal}>X</OutlineButton>
        </div>

        <div className="mx-2 my-4">{content}</div>
      </div>
    </aside>,
    document.body
  );
}
export { Modal, ModalStore, ModalContext };
