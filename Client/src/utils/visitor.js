import { v4 as uuidv4 } from "uuid";

export const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = uuidv4(); // Generate a new UUID
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};
