import React from "react";
import "./Label.scss";

const Label = (props: any) => {
  return (
    <>
      <label htmlFor={props.name} className={`label ${props.className || ""}`}>
        {props.label}
      </label>
    </>
  );
};

export default Label;
