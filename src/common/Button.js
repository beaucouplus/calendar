import React from "react";
import PropTypes from "prop-types";

function Button(
  {
    children,
    callBack,
    css = "",
    value = "",
    type = "button",
    ariaLabel = "",
    ariaLabelledBy = "",
    autoFocus = false,
    withFocus = true,
  },
  props
) {
  const focus = withFocus ? "focus:outline-none focus:shadow-outline" : "";

  return (
    <button
      onClick={callBack}
      className={`${css} ${focus}`}
      value={value}
      type={type}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      autoFocus={autoFocus}
      {...props}
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

function SubmitButton({
  css,
  value = "Submit",
  ariaLabel = "submit",
  ariaLabelledBy = "submit",
}) {
  return (
    <input
      type="submit"
      value={value}
      className={css}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    />
  );
}

function BlueSubmitButton({ value, ariaLabel, ariaLabelledBy }) {
  const blueStyle = `focus:outline-none focus:shadow-outline
                     bg-blue-500 hover:bg-blue-800 focus:bg-blue-800
                     text-xs text-white font-semibold hover:text-white
                     py-2 px-10
                     rounded
                     cursor-pointer`;

  return (
    <SubmitButton
      value={value}
      css={blueStyle}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
    />
  );
}

function OutlineSubmitButton({ value }) {
  const outlineStyle = `bg-transparent hover:bg-blue-700 focus:bg-blue-700
                 text-sm text-blue-700 font-semibold hover:text-white focus:text-white
                 py-2 px-2
                 border border-blue-700 hover:border-transparent focus:border-transparent
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
                 border border-blue-700 hover:border-transparent rounded
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

function OutlineButton({
  children,
  callBack,
  ariaLabel,
  ariaLabelledBy,
  autoFocus,
}) {
  const outlineStyle = `bg-transparent hover:bg-blue-800 focus:bg-blue-800
                 text-xs text-blue-700 font-semibold hover:text-white focus:text-white
                 py-2 px-4
                 border border-blue-700 hover:border-transparent rounded
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
  OutlineButton,
  OutlineSubmitButton,
  BlueSubmitButton,
  BlueButton,
};
