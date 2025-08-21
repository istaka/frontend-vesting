import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state: { hasError: boolean; error: any } = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error Boundary Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <h1>Something went wrong!</h1>
          <p>{this.state.error?.message || "Unknown error occurred."}</p>
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
