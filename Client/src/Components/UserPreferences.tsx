import React, { useState, useEffect } from "react";
import "./UserPreferences.css";
import { getVisitorId } from "../utils/visitor";

interface UserPreference {
  visitorId: string;
  selectedCategories: string[];
}

const UserPreferences: React.FC = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreference | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    const fetchVisitorPreference = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-visitor-preference?visitor_id=${visitorId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserPreferences(data); // Only store the fetched data in state for display
        } else {
          setError("Failed to fetch visitor preferences.");
        }
      } catch (err) {
        setError("Failed to fetch visitor preferences.");
      }
    };

    fetchVisitorPreference();
  }, []); // Empty dependency array ensures the request is made only once on component mount

  return (
    <div className="user-preference-container">
      {error && <div className="error">{error}</div>}
      {userPreferences ? (
        <div>
          <h2>Preferences</h2>
          <ul className="preference-list">
            {userPreferences.selectedCategories.map((category, index) => (
              <li key={index}>{category} </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserPreferences;
