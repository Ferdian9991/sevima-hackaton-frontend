import React, { useCallback, useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import PasswordStrengthBar from "react-password-strength-bar";
import { useSelector } from "react-redux";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import Table from "../utilities/Table";
import { useCookie } from "../layout/LoggedArea";
import Modal from "../utilities/Modal";
import ClassroomService from "../../services/ClassroomService";
import {
  showLoadingSpinner,
  hideLoadingSpinner,
  useNotification,
} from "../App";

const StudentComponent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [customCode, setCustomCode] = useState(false);
  const [classroomData, setTeacherData] = useState([]);
  const [openClassroomModal, setOpenClassroomModal] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const notification = useNotification();
  const loggedUser = useSelector((state) => state.credentials.userLogin);

  const getClassroom = async () => {
    try {
      setLoading(true);
      const response = await ClassroomService.getClassroom({
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
        const response = await ClassroomService.register(formData, {
          token: useCookie("token"),
        });
        hideLoadingSpinner();
        notification.showNotification({
          message: `${response.data.message}`,
          type: "success",
          dismissTimeout: 3000,
        });
        setOpenClassroomModal(false);
        getClassroom();
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
        const update = await ClassroomService.update(formData, {
          token: useCookie("token"),
        });
        setOpenClassroomModal(false);
        hideLoadingSpinner();
        notification.showNotification({
          message: `Successfully edit ${update.data.data.name}`,
          type: "success",
          dismissTimeout: 3000,
        });
        getClassroom();
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
          await ClassroomService.delete(
            {
              id: row.id,
            },
            {
              token: useCookie("token"),
            }
          );
        }
        getClassroom();
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
    getClassroom();
  }, []);

  useEffect(() => {
    !openClassroomModal && setFormData({});
  }, [openClassroomModal]);

  const columns = useMemo(
    () => [
      {
        Header: "Nama Kelas",
        accessor: "name",
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
            loading={loading}
            columns={columns}
            onEdit={
              loggedUser != null && loggedUser.role === "Teacher"
                ? ({ row }) => {
                    setFormData({
                      ...row,
                    });
                    setOpenClassroomModal(true);
                  }
                : false
            }
            data={classroomData}
            customTopButton={
              loggedUser != null && loggedUser.role === "Teacher" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenClassroomModal(true);
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
            modalOpen={openClassroomModal}
            setModalOpen={setOpenClassroomModal}
            modalTitle={!formData.id ? "Tambahkan kelas" : "Update kelas"}
            onSubmit={!formData.id ? handleRegister : handleUpdate}
            formElement={() => (
              <>
                <div>
                  <label
                    htmlFor="text"
                    tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    name="text"
                    value={formData.name || ""}
                    onChange={(e) => {
                      if (e) e.preventDefault();
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      });
                    }}
                    tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Nama Kelas"
                    required
                  />
                </div>
                {customCode && (
                  <div>
                    <label
                      htmlFor="text"
                      tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Kode kelas
                    </label>
                    <input
                      type="text"
                      name="text"
                      value={formData.code || ""}
                      onChange={(e) => {
                        if (e) e.preventDefault();
                        setFormData({
                          ...formData,
                          code: e.target.value,
                        });
                      }}
                      tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Username"
                      required
                    />
                  </div>
                )}
                <div tw="flex justify-between">
                  <div tw="flex items-start">
                    <div tw="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        onChange={() => {
                          !customCode
                            ? setCustomCode(true)
                            : setCustomCode(false);
                        }}
                        checked={customCode}
                        tw="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-[3px] focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <label
                      htmlFor="remember"
                      tw="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Kustomisasi kode kelas
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  tw="w-full text-white bg-cornflower-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {!formData.id ? "Tambah Kelas" : "Update Kelas"}
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
