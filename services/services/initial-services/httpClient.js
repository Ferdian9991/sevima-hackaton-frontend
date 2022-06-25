import axios from "axios";
import { toast } from "react-toastify";
import Router from "next/router";
import "react-toastify/dist/ReactToastify.min.css";
import ReactHtmlParser from "react-html-parser";
import { throttleAdapterEnhancer } from "axios-extensions";

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 1000 * (60 * 3),
  adapter: throttleAdapterEnhancer(axios.defaults.adapter, 2 * 1000),
});

axiosInstance.interceptors.response.use(
  function (response) {
    toast.success(response.data.message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    return Promise.resolve(response);
  },
  function (error) {
    if (!error.response) {
      return;
    }

    if (error.response.status == 401) {
      window.localStorage.clear();
      return Router.replace("/login");
    } else {
      let message = buildErrorMessage(error);

      toast.error(
        <div>
          <h4 style={{ color: "white", fontWeight: "bold" }}>Oops Error!</h4>
          {ReactHtmlParser(message)}
        </div>,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000 * 5,
        }
      );
    }
    return Promise.reject(error.response);
  }
);

const buildErrorMessage = (error) => {
  let message = "";
  if (error.response.data) {
    if (error.response.status === 422) {
      message = error.response.data.data;
    } else if (
      error.response.data.data &&
      error.response.data.data.length > 0
    ) {
      message = error.response.data.data;
    } else if (error.response.data.values) {
      message = error.response.data.values;
    } else {
      message = error.response.data.message;
    }
  }
  let flashMessage = [];

  if (typeof message === "object") {
    for (let err of Object.keys(message)) {
      if (message[err].length > 0) {
        flashMessage.push(message[err][0]);
      } else {
        flashMessage.push(message[err]);
      }
    }
  } else {
    flashMessage = message;
  }

  if (Array.isArray(flashMessage) && flashMessage.length > 0) {
    flashMessage = flashMessage.join("<br/>");
  } else {
    flashMessage = flashMessage;
  }
  return flashMessage;
};

export default axiosInstance;
