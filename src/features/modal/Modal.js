import React, { useRef } from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";
import ReactDOM from "react-dom";
import FocusTrap from "focus-trap-react";
import useOnclickOutside from "react-cool-onclickoutside";

// COMPONENTS
import { ModalButton } from "../../common/Button";

function Modal({ children, showModal, onCloseModal }) {
  const modalContent = useRef();

  useOnclickOutside(modalContent, () => {
    onCloseModal();
  });

  return (
    <>
      {showModal ? (
        <ModalContent onCloseModal={onCloseModal} modalContentRef={modalContent}>
          {children}
        </ModalContent>
      ) : (
        <React.Fragment />
      )}
    </>
  );
}

Modal.propTypes = exact({
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool,
  onCloseModal: PropTypes.func.isRequired,
});

function ModalContent({ children, onCloseModal, modalContentRef }) {
  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      onCloseModal();
    }
  };

  return ReactDOM.createPortal(
    <FocusTrap>
      <aside
        className="fixed top-0 left-0 w-screen h-screen flex items-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        onKeyDown={onKeyDown}
      >
        <div ref={modalContentRef} className="static box-border top-0 right-0 h-screen w-sm bg-white border shadow-md">
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

          <div className="h-full box-border overflow-auto flex flex-col justify-start">{children}</div>
        </div>
      </aside>
    </FocusTrap>,
    document.body
  );
}

ModalContent.propTypes = exact({
  children: PropTypes.node.isRequired,
  modalContentRef: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
});

export default Modal;
