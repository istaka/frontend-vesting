import { Button } from "antd";
import "./ButtonCustomStyle.scss";

const ButtonCustom = (props) => {
  const { secondary, leftIcon, label, onlyIcon, customClass } = props;
  return (
    <Button
      className={`btnCustom ${secondary ? "secondary" : ""} ${customClass}`}
      {...props}
    >
      {leftIcon && <span className="leftIcon">{leftIcon}</span>}
      {label && label}
      {onlyIcon && <span className="onlyIcon">{onlyIcon}</span>}
    </Button>
  );
};

export { ButtonCustom };
