export const ROLES = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
};

// Single source of truth for complaint categories. The backend SLA engine
// (slaService.js) keys its response-time targets on the UPPERCASED versions of
// these values, so keep the two in sync.
export const COMPLAINT_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Network",
  "Cleanliness",
  "Security",
  "Furniture",
  "Maintenance",
  "Other",
];