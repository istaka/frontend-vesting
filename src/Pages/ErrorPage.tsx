import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error: any = useRouteError();

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
      <h1>Oops! An error occurred.</h1>
      <p>{error?.message || "Unknown error occurred."}</p>
      <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
        {error?.stack}
      </pre>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  );
};

export default ErrorPage;
