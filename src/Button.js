import React from "react";
import PropTypes from "prop-types";

function Button({
  children,
  callBack,
  css = "",
  value = "",
  type = "button",
  ariaLabel = "",
  ariaLabelledBy = "",
  autoFocus = false,
}) {
  return (
    <button
      onClick={callBack}
      className={`${css} focus:outline-none focus:shadow-outline`}
      value={value}
      type={type}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  callBack: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  css: PropTypes.string,
};

function BlueButton({ children, callBack }) {
  const blueStyle = `
                 bg-blue-500 hover:bg-blue-700
                 text-xs text-white font-semibold hover:text-white
                 py-2 px-4
                 border hover:border-blue-400
                 cursor-pointer`;

  return (
    <Button callBack={callBack} css={blueStyle}>
      {children}
    </Button>
  );
}

function SubmitButton({ css, value = "Submit" }) {
  return <input type="submit" value={value} className={css} />;
}

function BlueSubmitButton({ value }) {
  const blueStyle = `w-1/3
                 bg-blue-500 hover:bg-blue-800
                 text-xs text-white font-semibold hover:text-white
                 py-2 px-2
                 border border-blue-700 hover:border-blue-800
                 cursor-pointer`;

  return <SubmitButton value={value} css={blueStyle} />;
}

function OutlineSubmitButton({ value }) {
  const outlineStyle = `bg-transparent hover:bg-blue-700
                 text-sm text-blue-700 font-semibold hover:text-white
                 py-2 px-2
                 border border-blue-700 hover:border-transparent 
                 rounded
                 `;

  return <SubmitButton value={value} css={outlineStyle} />;
}

function ModalButton({
  children,
  callBack,
  ariaLabel,
  ariaLabelledBy,
  autoFocus,
}) {
  const outlineStyle = `bg-transparent hover:bg-blue-800
                 text-xs text-blue-700 font-semibold hover:text-white
                 py-1 px-2
                 border border-blue-700 hover:border-transparent
                 `;

  return (
    <Button
      callBack={callBack}
      css={outlineStyle}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      autoFocus={autoFocus}
    >
      {children}
    </Button>
  );
}

export {
  Button,
  SubmitButton,
  ModalButton,
  OutlineSubmitButton,
  BlueSubmitButton,
  BlueButton,
};
