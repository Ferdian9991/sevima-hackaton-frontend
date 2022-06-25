import React, { useContext, useState, useEffect } from "react";
import NProgress from "nprogress";
import Router from "next/router";
import { motion } from "framer-motion";
import {
  NotificationProvider,
  NotificationContext,
} from "./utilities/Notification";
import LoadingSpinner from "./utilities/LoadingSpinner";

Router.onRouteChangeStart = (url) => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

let _loadingSpinner = React.createRef();

const App = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  const [appId] = useState(
    Math.random()
      .toString(36)
      .replace("0.", "__app_" || "")
  );

  useEffect(() => {
    setMounted(true);
    if (process.env.NODE_ENV === "production") {
      console.log(
        `%cIni adalah fitur browser yang ditujukan untuk developer. Jika seseorang meminta Anda untuk menyalin-menempel sesuatu di sini untuk mengaktifkan fitur atau "meretas" akun seseorang, ini adalah penipuan dan akan memberikannya akses ke akun Anda!!`,
        "font-weight: normal; font-size: 17px; color: #000;"
      );
    }
  }, []);

  return (
    <NotificationProvider>
      <motion.div
        animate={mounted ? "visible" : "invisible"}
        initial="invisible"
        variants={{
          invisible: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
          },
        }}
        transition={{ duration: 0.5, delay: 0 }}
        id={appId}
      >
        {children}

        <LoadingSpinner
          visible={false}
          ref={(comp) => {
            _loadingSpinner = comp;
          }}
        />
      </motion.div>
    </NotificationProvider>
  );
};
export default App;

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const showLoadingSpinner = () => {
  if (!_loadingSpinner || !_loadingSpinner.show) return;
  _loadingSpinner.show();
};

export const hideLoadingSpinner = () => {
  if (!_loadingSpinner || !_loadingSpinner.show) return;
  _loadingSpinner.hide();
};
