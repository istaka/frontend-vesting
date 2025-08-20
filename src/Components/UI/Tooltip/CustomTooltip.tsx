import { ReactNode } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "./CustomTooltip.scss";

const CustomTooltip = ({
  children,
  content,
  placement,
}: {
  children?: ReactNode;
  content?: ReactNode;
  placement?: any;
}) => {
  return (
    <OverlayTrigger
      key="top"
      placement={placement ? placement : "top"}
      overlay={<Tooltip className="custom-tooltip">{content}</Tooltip>}
      delay={{ show: 250, hide: 400 }}
    >
      <span>{children}</span>
    </OverlayTrigger>
  );
};

export default CustomTooltip;
