import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  else return null;
};

const LoggedArea = ({ children }) => {
  const router = useRouter();
  const loggedUser = useSelector((state) => state.credentials.userLogin);
  const isLoggedInUser = isLoggedIn(loggedUser);

  if (isLoggedInUser) {
    return <React.Fragment>{children}</React.Fragment>;
  } else {
    router.replace("/login");
    return <React.Fragment></React.Fragment>;
  }
};

export default LoggedArea;

export const isLoggedIn = (user) => {
  const cookieToken = getCookie("token");
  if (!Boolean(user) || cookieToken === null) {
    return false;
  } else {
    return true;
  }
};

export const useCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  else return null;
};
