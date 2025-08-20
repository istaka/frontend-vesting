import "./CustomButton.scss";

const CustomButton = ({
  text,
  onClick,
  className,
  disabled,
  icon,
}: {
  text?: string | any;
  onClick?: any;
  className?: string;
  disabled?: any;
  icon?: any;
}) => {
  return (
    <button
      disabled={disabled}
      className={`custom-button ${className ? className : ""}`}
      onClick={onClick}
    >
      {text}
      {icon ? <span className="btn-icon">{icon}</span> : ""}
    </button>
  );
};

export default CustomButton;
