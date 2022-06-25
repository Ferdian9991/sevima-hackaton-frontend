import React, { useCallback, useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSelector } from "react-redux";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import Table from "../utilities/Table";
import { useCookie } from "../layout/LoggedArea";
import Modal from "../utilities/Modal";
import UserService from "../../services/UserService";
import {
  showLoadingSpinner,
  hideLoadingSpinner,
  useNotification,
} from "../App";

const StudentComponent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [studentData, setTeacherData] = useState([]);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const notification = useNotification();
  const loggedUser = useSelector((state) => state.credentials.userLogin);

  const getStudent = async () => {
    try {
      setLoading(true);
      const response = await UserService.getStudent({
        token: useCookie("token"),
      });
      response.data && setTeacherData(response.data.data);
      setLoading(false);
    } catch (e) {
      e.data
        ? notification.showNotification({
            message: `${e.data.message}`,
            type: "danger",
            dismissTimeout: 3000,
          })
        : notification.handleError(e);
    }
  };

  const handleShowPassword = useCallback(() => {
    !passwordVisibility
      ? setPasswordVisibility(true)
      : setPasswordVisibility(false);
  }, [passwordVisibility]);

  const handleRegister = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        const response = await UserService.register({
          ...formData,
          role: "Student",
        });
        hideLoadingSpinner();
        notification.showNotification({
          message: `${response.data.message}`,
          type: "success",
          dismissTimeout: 3000,
        });
        setOpenStudentModal(false);
        getStudent();
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
    [formData]
  );

  const handleUpdate = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        const update = await UserService.update(formData, {
          token: useCookie("token"),
        });
        setOpenStudentModal(false);
        hideLoadingSpinner();
        notification.showNotification({
          message: `Successfully edit ${update.data.data.username}`,
          type: "success",
          dismissTimeout: 3000,
        });
        getStudent();
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
    [formData]
  );

  const handleDelete = useCallback(async ({ rows }) => {
    try {
      if (confirm(`Are you sure delete ${rows.length}`) == true) {
        for (const row of rows) {
          await UserService.delete(
            {
              id: row.id,
            },
            {
              token: useCookie("token"),
            }
          );
        }
        getStudent();
        notification.showNotification({
          message: `Successfully delete ${rows.length} device!`,
          type: "success",
          dismissTimeout: 3000,
        });
      }
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
  }, []);

  useEffect(() => {
    getStudent();
  }, []);

  useEffect(() => {
    !openStudentModal && setFormData({});
  }, [openStudentModal]);

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Nama Lengkap",
        accessor: "fullname",
      },
      {
        Header: "Nomer Telepon",
        accessor: "phoneNumber",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Jenis Kelamin",
        accessor: "gender",
      },
      {
        Header: "Role",
        accessor: "role",
      },
    ],
    []
  );
  return (
    <LoggedArea>
      <Layout header={{ title: "Data Siswa" }}>
        <div tw="py-10">
          <Table
            onRemove={
              loggedUser != null && loggedUser.role === "Teacher"
                ? handleDelete
                : false
            }
            onWhatsapp={({ row }) => {
              console.log(row);
              window.location.replace(
                `https://api.whatsapp.com/send?phone=${row.phoneNumber}`
              );
            }}
            loading={loading}
            columns={columns}
            onEdit={
              loggedUser != null && loggedUser.role === "Teacher"
                ? ({ row }) => {
                    setFormData({
                      ...row,
                    });
                    setOpenStudentModal(true);
                  }
                : false
            }
            data={studentData}
            customTopButton={
              loggedUser != null && loggedUser.role === "Teacher" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenStudentModal(true);
                  }}
                  className="h-9 w-9 text-white bg-gray-600 rounded-full shadow focus:outline-none mr-2"
                >
                  <i className="fa fa-plus"></i>
                </button>
              ) : (
                false
              )
            }
          />

          {/**
           * CRUD Modal
           */}

          <Modal
            modalOpen={openStudentModal}
            setModalOpen={setOpenStudentModal}
            modalTitle={!formData.id ? "Tambahkan Siswa" : "Update Siswa"}
            onSubmit={!formData.id ? handleRegister : handleUpdate}
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
                    value={formData.username || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
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
                    value={formData.fullname || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
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
                    value={formData.phoneNumber || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
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
                    value={formData.email || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
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
                    Jenis Kelamin
                  </label>
                  <select
                    required
                    value={formData.gender || ""}
                    tw="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Pilih Kelamin</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Kode Kelas
                  </label>
                  <input
                    type="text"
                    name="classCode"
                    value={formData.classCode || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
                        classCode: e.target.value,
                      });
                    }}
                    tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Kode Kelas"
                    required
                  />
                </div>
                {!formData.id && (
                  <>
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
                        value={formData.password || ""}
                        onChange={(e) => {
                          if (e) e.preventDefault();
                          setFormData({
                            ...formData,
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
                          />
                        </div>
                        <label
                          htmlFor="remember"
                          tw="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Lihat Password
                        </label>
                      </div>
                      <div tw="w-[50%]">
                        <PasswordStrengthBar
                          password={formData.password}
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
                  </>
                )}
                <button
                  type="submit"
                  tw="w-full text-white bg-cornflower-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {!formData.id ? "Register Siswa" : "Update Siswa"}
                </button>
              </>
            )}
          />
        </div>
      </Layout>
    </LoggedArea>
  );
};

export default StudentComponent;
