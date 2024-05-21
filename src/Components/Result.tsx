import React from "react";
import { useLocation } from "react-router-dom";

const Result: React.FC = () => {
  const location = useLocation();
  const { results } = location.state as { results: any };

  return (
    <div>
      <h1>Search Results</h1>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default Result;
