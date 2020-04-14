import React from "react";

const Button = ({ children, callBack }) => (
  <button onClick={callBack} className="px-1 focus:outline-none">
    {children}
  </button>
);

export default Button;
