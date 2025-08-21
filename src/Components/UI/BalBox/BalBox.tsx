/** @format */

import React from "react";
import "./BalBox.scss";

export const BalBox = (props: any) => {
  return (
    <>
      <div className='bal-box'>
        <p>{props.BalHeading}</p>
        <span>{props.BalAmt}</span>
        <br />
        <span>{`($ ${props.UsdPrice})`}</span>
      </div>
    </>
  );
};
