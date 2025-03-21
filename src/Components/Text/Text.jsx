import React from "react";

import PropTypes from "prop-types";

import classes from "./Text.module.css";

const Text = (props) => {
  return (
    <div
      className={`${classes.container} ${props.className}`}
      style={props.style}
    >
      <span className={classes.text}>{props.text}</span>
    </div>
  );
};

Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Text;
