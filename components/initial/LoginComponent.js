import React, { useCallback, useEffect, useState } from "react";
import tw, { css } from "twin.macro";
import Image from "next/image";
import PasswordStrengthBar from "react-password-strength-bar";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../redux/redux-actions/authentication";
import {
  useNotification,
  showLoadingSpinner,
  hideLoadingSpinner,
} from "../App";
import { Desktop } from "../utilities/ResponsiveUtil";
import AuthService from "../../services/AuthService";
import { isLoggedIn } from "../layout/LoggedArea";
import Modal from "../utilities/Modal";

const login = () => {
  const [loginForm, setLoginForm] = useState({});
  const [registerForm, setRegisterForm] = useState({});
  const [openRegister, setOpenRegister] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const router = useRouter();
  const notification = useNotification();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.credentials.userLogin);

  const handleLogin = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        const response = await AuthService.login(loginForm);
        dispatch(logIn(loginForm, response.data));
        router.replace("/");
        hideLoadingSpinner();
      } catch (e) {
        hideLoadingSpinner();
        e.data
          ? notification.showNotification({
              message: `${e.data.message}`,
              type: "danger",
              dismissTimeout: 3000,
            })
          : notification.handleError(e);
      }
    },
    [loginForm]
  );

  const handleRegister = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        const response = await AuthService.register(registerForm);
        hideLoadingSpinner();
        notification.showNotification({
          message: `${response.data.message}`,
          type: "success",
          dismissTimeout: 3000,
        });
        setOpenRegister(false);
      } catch (e) {
        hideLoadingSpinner();
        e.data
          ? notification.showNotification({
              message: `${e.data.message}`,
              type: "danger",
              dismissTimeout: 3000,
            })
          : notification.handleError(e);
      }
    },
    [registerForm]
  );

  const handleShowPassword = useCallback(() => {
    !passwordVisibility
      ? setPasswordVisibility(true)
      : setPasswordVisibility(false);
  }, [passwordVisibility]);

  useEffect(() => {
    if (!openRegister) {
      setRegisterForm({});
    }
  }, [openRegister]);

  const renderLoginComponent = () => {
    return (
      <React.Fragment>
        <section tw="h-screen bg-white-lilac-400">
          <div tw="h-full text-gray-800">
            <Modal
              modalOpen={openRegister}
              setModalOpen={setOpenRegister}
              modalTitle={"Daftar dan bergabung"}
              onSubmit={handleRegister}
              formElement={() => (
                <>
                  <div>
                    <label
                      htmlFor="username"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Username
                    </label>
                    <input
                      type="username"
                      name="username"
                      value={registerForm.username || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setRegisterForm({
                          ...registerForm,
                          username: e.target.value,
                        });
                      }}
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fullname"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={registerForm.fullname || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setRegisterForm({
                          ...registerForm,
                          fullname: e.target.value,
                        });
                      }}
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Nama Lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phonenumber"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Nomer Telepon
                    </label>
                    <input
                      type="number"
                      name="phonenumber"
                      value={registerForm.phoneNumber || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setRegisterForm({
                          ...registerForm,
                          phoneNumber: e.target.value,
                        });
                      }}
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Nomer Telepon"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        });
                      }}
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <input
                      type={passwordVisibility ? "text" : "password"}
                      name="password"
                      value={registerForm.password || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        });
                      }}
                      placeholder="Password"
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>

                  <div tw="flex justify-between">
                    <div tw="flex items-start">
                      <div tw="flex items-center h-5">
                        <input
                          id="remember"
                          type="checkbox"
                          onChange={handleShowPassword}
                          checked={passwordVisibility}
                          tw="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-[3px] focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                          required
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        tw="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Show password
                      </label>
                    </div>
                    <div tw="w-[50%]">
                      <PasswordStrengthBar
                        password={registerForm.password}
                        shortScoreWord={"Terlalu lemah"}
                        scoreWords={[
                          "Sangat lemah",
                          "Lemah",
                          "Sedang",
                          "Kuat",
                          "Sangat kuat",
                        ]}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    tw="w-full text-white bg-cornflower-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Buat akun baru
                  </button>
                </>
              )}
            />
            <div tw="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full">
              <Desktop tw="flex-grow-0 h-[350px] sm:h-[100%] flex-shrink-[1] md:flex-shrink-0 flex-auto w-6/12 mb-12 md:mb-0">
                <div tw="h-[100vh] sticky top-0 left-0 bottom-0 right-0 grid grid-cols-1 content-center">
                  <div tw="flex flex-col w-full">
                    <div tw="block mx-auto py-20 px-14 rounded-xl">
                      <Image
                        src={"/images/login.png"}
                        width={"500px"}
                        height={"230px"}
                        layout="fixed"
                      />
                    </div>
                  </div>
                </div>
              </Desktop>

              <div tw="px-6 lg:px-10 xl:px-20 w-full md:w-5/12 sm:w-5/12  mb-12 md:mb-0">
                <div tw="flex flex-row items-center justify-center lg:justify-start">
                  <p tw="text-lg mb-0 mr-4">Masuk dengan platform</p>
                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    tw="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      tw="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    tw="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      tw="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    tw="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      tw="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                      />
                    </svg>
                  </button>
                </div>

                <div tw="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                  <p tw="text-center font-semibold mx-4 mb-0">Or</p>
                </div>
                <form onSubmit={handleLogin}>
                  <div tw="mb-6">
                    <input
                      type="text"
                      tw="block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Username"
                      value={loginForm.username || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setLoginForm({
                          ...loginForm,
                          username: e.target.value,
                        });
                      }}
                      autoFocus
                      required
                    />
                  </div>

                  <div tw="mb-6">
                    <input
                      type={passwordVisibility ? "text" : "password"}
                      tw="block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Password"
                      value={loginForm.password || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        });
                      }}
                      autoFocus
                      required
                    />
                  </div>
                  <div tw="flex justify-between items-center mb-6">
                    <div className="group" tw="cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={handleShowPassword}
                        checked={passwordVisibility}
                        tw="appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      />
                      <label
                        tw="inline-block text-gray-800"
                        htmlFor="exampleCheck2"
                      >
                        Lihat password
                      </label>
                    </div>
                    <a href="#!" tw="text-gray-800">
                      Masuk dashboard
                    </a>
                  </div>

                  <div tw="text-center lg:text-left">
                    <button
                      type="submit"
                      tw="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <p tw="text-sm font-semibold mt-2 pt-1 mb-0">
                  Tidak mempunyai akun?
                  <button
                    onClick={(e) => {
                      if (e) e.preventDefault();
                      setOpenRegister(true);
                      setPasswordVisibility(false);
                    }}
                    tw="text-red-600 hover:text-red-700 cursor-pointer focus:text-red-700 transition duration-200 ease-in-out ml-2"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  };

  const redirectBack = () => {
    router.replace("/");
    return <React.Fragment></React.Fragment>;
  };

  return !isLoggedIn(loggedUser) ? renderLoginComponent() : redirectBack();
};

export default login;
