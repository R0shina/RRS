// utils/auth.js

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true"; // Check if the user is logged in
};

export const login = () => {
  localStorage.setItem("isLoggedIn", "true"); // Set login status
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn"); // Remove login status
};
