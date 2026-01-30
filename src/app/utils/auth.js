import { deleteCookie, getCookie } from "cookies-next";

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  deleteCookie("access");
  
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!getCookie("access");
};