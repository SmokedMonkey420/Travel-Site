// LoadingBar.tsx
import React from "react";
import "./LoadingBar.css";

const LoadingBar: React.FC = () => {
  return (
    <div className="loading-bar">
      <div className="loading-bar-progress"></div>
    </div>
  );
};

export default LoadingBar;
