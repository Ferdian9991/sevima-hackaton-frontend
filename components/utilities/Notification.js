import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tw from "twin.macro";

export const NotificationContext = createContext();

const DEFAULT_NOTIFICATION_STATE = {
  dismissTimeout: 3000,
  children: null,
  message: "",
  type: "success",
  show: false,
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

const useBaseNotification = () => {
  const [notificationState, setNotificationState] = useState(
    DEFAULT_NOTIFICATION_STATE
  );

  useEffect(() => {
    if (notificationState.show) {
      let timer = setTimeout(() => {
        setNotificationState((latestState) => ({
          ...latestState,
          show: false,
        }));
      }, notificationState.dismissTimeout || 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notificationState.show]);

  const showNotification = ({
    children,
    message,
    type,
    level,
    dismissTimeout,
  }) => {
    let timeout = 1;
    if (notificationState.show) {
      timeout = 150;
      setNotificationState({
        ...notificationState,
        show: false,
      });
    }

    setTimeout(() => {
      const newState = {
        ...notificationState,
        type: level || type || "success",
        children,
        message,
        show: true,
      };
      if (dismissTimeout && dismissTimeout > 0) {
        newState.dismissTimeout = dismissTimeout;
      }
      setNotificationState(newState);
    }, timeout);
  };

  const clearNotifications = (e) => {
    if (e) e.preventDefault();
    setNotificationState({
      ...notificationState,
      show: false,
    });
  };

  const handleError = (error) => {
    if (error.message) {
      if (error.message.indexOf("Network error") >= 0) {
        error.message = "Network error! Please try again later.";
      } else {
        error.message = error.message.replace("GraphQL error: ", "");
      }
    } else {
      error.message = "Unknown error! Please try again later.";
    }
    console.warn("Handling error:", error.message);
    showNotification({
      title: "Terdapat Error",
      message: error.message,
      type: error.type ? error.type : "danger",
    });
  };

  return {
    notificationState,
    showNotification,
    addNotification: showNotification,
    clearNotifications,
    handleError,
  };
};

export const NotificationProvider = ({ children }) => {
  const notification = useBaseNotification();

  return (
    <NotificationContext.Provider value={notification}>
      {children}
      <Notification
        {...notification.notificationState}
        onClose={notification.clearNotifications}
      />
    </NotificationContext.Provider>
  );
};

const Notification = ({ message, children, type, show, onClose }) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            type: "tween",
            default: { duration: 0.5 },
          }}
          tw="z-50 w-full md:w-1/4 fixed bottom-0 right-0 mb-8 md:mr-8 px-8 md:px-0 overflow-y-auto"
        >
          {children || (
            <div
              onClick={onClose}
              tw={
                "flex items-center w-full px-6 py-6 text-sm md:text-sm rounded-md shadow-lg relative cursor-pointer"
              }
              className={
                type === "success"
                  ? " text-white bg-green-500 hover:bg-green-600"
                  : type === "danger" || type === "error"
                  ? " text-white bg-red-600 hover:bg-red-700"
                  : type === "info"
                  ? " text-white bg-orange-600 hover:bg-orange-700"
                  : " text-white bg-primary-500 hover:bg-primary-600"
              }
            >
              <i
                className="fa fa-times-circle"
                tw="cursor-pointer text-lg absolute mt-2 mr-2 top-0 right-0"
              ></i>
              {message}
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Notification;

const LEVEL_twS = {
  info: "bg-blue-100 border-blue-300 text-blue-700",
  success: "bg-green-100 border-green-300 text-green-700",
  danger: "bg-red-100 border-red-300 text-red-700",
};
const LEVEL_ICON = {
  info: "fa fa-info-circle",
  success: "fa fa-check-circle",
  danger: "fa fa-exclamation-triangle",
};
export const InlineNotificationBar = () => {
  const { notificationState } = useNotification();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!notificationState.show) return;
    setVisible(true);
  }, [notificationState.show]);

  if (!visible || !notificationState?.message) return null;
  return (
    <div
      className="LEVEL_twS[notificationState?.type]"
      tw="flex w-full px-4 justify-between border-b"
    >
      <div tw="px-3 py-4">
        <i className={LEVEL_ICON[notificationState?.type]} />{" "}
        {notificationState?.message}
      </div>
      <a
        href="#"
        tw="block px-3 py-4 hover:opacity-50 transition duration-200"
        onClick={(e) => {
          if (e) e.preventDefault();
          setVisible(false);
        }}
      >
        <i className="fa fa-times" />
      </a>
    </div>
  );
};

export const InlineNotificationCard = () => {
  const { notificationState } = useNotification();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!notificationState.show) return;
    setVisible(true);
  }, [notificationState.show]);

  if (!visible || !notificationState?.message) return null;
  return (
    <div tw="p-4">
      <div
        className={LEVEL_twS[notificationState?.type]}
        tw="flex w-full px-4 justify-between border border-b-4 rounded-md"
      >
        <div tw="px-3 py-4">
          <i className={LEVEL_ICON[notificationState?.type]} />
          {notificationState?.message}
        </div>
        <a
          href="#"
          tw="block px-3 py-4 hover:opacity-50 transition duration-200"
          onClick={(e) => {
            if (e) e.preventDefault();
            setVisible(false);
          }}
        >
          <i className="fa fa-times" />
        </a>
      </div>
    </div>
  );
};
