import "./Shimmer.scss";

type propTypes = {
  fluid?: boolean;
  width?: string;
  height?: string;
  className?: string;
};

const Shimmer = (props: propTypes) => {
  return (
    <>
      <span
        style={{
          width: props.fluid ? "100%" : props.width || "200px",
          height: props.height || "40px",
        }}
        className={`shimmer ${props.className || ""}`}
      />
    </>
  );
};

export default Shimmer;
