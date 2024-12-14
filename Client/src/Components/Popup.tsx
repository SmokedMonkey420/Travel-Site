import React, { useState, useEffect } from "react";
import { getVisitorId } from "../utils/visitor.js";
import "./Popup.css";

// Define categories
const categories = [
  "Adventure & Eco-Tourism Areas",
  "Agricultural Areas",
  "Beaches",
  "Historical & Cultural Sites",
  "Island Escapes & Resorts",
  "Mountains & Hiking Spots",
  "Natural Features & Scenic Spots",
  "Religious Or Cultural Spots",
  "Urban Or City Centers",
  "Wildlife & Nature Reserves",
];

// Fetch visitor data from the backend
const fetchVisitorData = async (visitorId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/get-visitor-data/${visitorId}`
    );
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch visitor data from server:", error);
    return null;
  }
};

// Function to send data to Flask backend
const storeDataToBackend = async (visitorId, selectedCategories) => {
  try {
    const response = await fetch("http://localhost:5000/store-visitor-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        selectedCategories,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();
    console.log("Response from server:", result);
  } catch (error) {
    console.error("Failed to store data to server:", error);
  }
};

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const checkVisitor = async () => {
      try {
        // Generate/retrieve visitor ID
        const visitorId = getVisitorId();

        // Fetch visitor data from backend
        console.log("Checking visitor data...");
        const visitorData = await fetchVisitorData(visitorId);

        if (visitorData && visitorData.selectedCategories?.length > 0) {
          // Visitor exists and has selected categories; do not show popup
          setSelectedCategories(visitorData.selectedCategories);
          setIsVisible(false);
        } else {
          // Visitor does not exist or has no selected categories; show popup
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Error checking visitor data:", error);
        setIsVisible(true); // Default to showing popup if there's an error
      }
    };

    checkVisitor();
  }, []);

  // Handle user toggling categories
  const toggleCategory = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((item) => item !== category) // Remove category if already selected
          : [...prev, category] // Add category if not selected
    );
  };

  const handleClose = async () => {
    try {
      // Save to localStorage
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(selectedCategories)
      );

      // Generate/retrieve visitor ID
      const visitorId = getVisitorId();

      // Log visitor ID & categories to backend (MongoDB via Flask backend)
      console.log("Storing data to backend...");
      await storeDataToBackend(visitorId, selectedCategories);

      setIsVisible(false); // Close popup
    } catch (error) {
      console.error("Error saving data to backend:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Select Categories</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li
              key={category}
              className={
                selectedCategories.includes(category) ? "selected" : ""
              }
              onClick={() => toggleCategory(category)} // Handle user click
            >
              {category}
            </li>
          ))}
        </ul>
        <button className="close-btn" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
