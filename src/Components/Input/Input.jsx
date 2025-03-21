import React from "react";

import PropTypes from "prop-types";

import classes from "./Input.module.css";

const Input = ({ className, style, label, error, ...props }) => {
  return (
    <div className={`${classes.container} ${className}`} style={style}>
      <label className={classes.inputLabel} htmlFor={props.id}>
        {label}
      </label>
      <input
        className={classes.input}
        aria-invalid={props.error ? "true" : "false"}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
};

export default Input;
