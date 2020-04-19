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
    <aside
      className="fixed top-0 left-0 w-screen h-screen flex items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }}
    >
      <div className="bg-white top-50 left-50 w-1/3 max-w-lg mx-auto p-2 shadow-md border rounded-lg">
        <div className="w-full flex items-center justify-end flex-wrap p-1">
          <OutlineButton callBack={onCloseModal}>✕</OutlineButton>
        </div>

        <div className="mx-2 px-1 pt-1 pb-12">{content}</div>
      </div>
    </aside>,
    document.body
  );
}
export { Modal, ModalStore, ModalContext };
