import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { logout } from "../redux/redux-actions/authentication";
import {
  useNotification,
  showLoadingSpinner,
  hideLoadingSpinner,
} from "../components/App";

const LogoutComponent = () => {
  const router = useRouter();
  const notification = useNotification();

  const auth = useSelector((state) => state.credentials);
  const isLoggedIn = auth.isLoggedIn;

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        showLoadingSpinner();
        try {
          dispatch(logout());
          hideLoadingSpinner();
          router.push("/");
          notification.showNotification({
            message: `Success fully sign out!`,
            type: "success",
            dismissTimeout: 3000,
          });
        } catch (e) {
          notification.handleError(e);
          router.push("/");
          hideLoadingSpinner();
        }

        return;
      }
      router.push("/");
    })();
  }, []);

  return <React.Fragment />;
};

export default LogoutComponent;
