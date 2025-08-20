import React from "react";
import { Button } from "antd";
import "./CommonButtonStyle.scss";

const CommonButton = (props: any) => {
  return (
    <Button {...props} className={`Custombtn ${props.className}`}>
      {props.title}
    </Button>
  );
};

export { CommonButton };
