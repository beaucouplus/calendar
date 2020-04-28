import React from "react";
import PropTypes from "prop-types";

function Button({ children, callBack, css = "", value = "", type = "button" }) {
  return (
    <button
      onClick={callBack}
      className={`${css} focus:outline-none`}
      value={value}
      type={type}
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

function OutlineButton({ children, callBack }) {
  const outlineStyle = `bg-transparent hover:bg-blue-800
                 text-xs text-blue-700 font-semibold hover:text-white
                 py-1 px-2
                 border border-blue-700 hover:border-transparent
                 `;

  return (
    <Button callBack={callBack} css={outlineStyle}>
      {children}
    </Button>
  );
}

function HeaderButton({ children, callBack }) {
  const style = `flex flex-row
                 min-h-full
                 bg-blue-100 hover:bg-blue-700
                 text-base text-blue-800 font-semibold hover:text-white
                 py-2 px-4
                 border-r-2 border-l-2 hover:border-blue-700
                 cursor-pointer`;

  return (
    <Button callBack={callBack} css={style}>
      {children}
    </Button>
  );
}

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

export {
  Button,
  OutlineButton,
  SubmitButton,
  OutlineSubmitButton,
  BlueSubmitButton,
  BlueButton,
  HeaderButton,
};
