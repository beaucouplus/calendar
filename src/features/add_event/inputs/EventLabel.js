import React from "react";

// PACKAGES
import PropTypes from "prop-types";
import exact from "prop-types-exact";

function EventLabel({ children }) {
  return <label className="block w-full leading-relaxed tracking-wider text-blue-700 ">{children}</label>;
}

EventLabel.propTypes = exact({
  children: PropTypes.node.isRequired,
});

export default EventLabel;
