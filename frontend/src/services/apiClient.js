// ✅ FIXED: Response body can only be read once

export async function apiRequest(path, options = {}) {
  const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  const url = base + path;

  // Get token from the correct localStorage key
  const getToken = () => {
    try {
      const authData = localStorage.getItem("hostel_auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token;
      }
      return null;
    } catch (error) {
      console.error("Error reading token:", error);
      return null;
    }
  };

  const headers = {
    "Content-Type": "application/json",
    ...(options.auth ? { Authorization: `Bearer ${getToken()}` } : {}),
  };

  try {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    // ✅ FIXED: Read response body ONCE as text first
    const responseText = await res.text();

    if (!res.ok) {
      let errorMsg = "Request failed";

      try {
        // Try to parse as JSON
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.error || errorData.message || errorMsg;
      } catch {
        // If not JSON, use the text directly
        errorMsg = responseText || `HTTP ${res.status}: ${res.statusText}`;
      }

      throw new Error(errorMsg);
    }

    // Parse successful response as JSON
    try {
      return JSON.parse(responseText);
    } catch {
      // If response is not JSON, return empty object
      return {};
    }
  } catch (error) {
    // Network errors or other issues
    console.error("API Request Error:", error);
    throw error;
  }
}
