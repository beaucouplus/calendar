import React from "react";
import PropTypes from "prop-types";

function Button({ children, callBack, css = "" }) {
  return (
    <button onClick={callBack} className={`${css} px-1 focus:outline-none`}>
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
  const outlineStyle = `bg-transparent hover:bg-gray-700
                 text-xs text-gray-700 font-semibold hover:text-white
                 py-1 px-2
                 border border-gray-700 hover:border-transparent
                 rounded`;

  return (
    <Button callBack={callBack} css={outlineStyle}>
      {children}
    </Button>
  );
}

export { Button, OutlineButton };
