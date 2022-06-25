import React, { useCallback, useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import moment from "moment";
import "moment/locale/id";
import { useMediaQuery } from "react-responsive";
import ReactHtmlParser from "react-html-parser";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import Table from "../utilities/Table";
import { useCookie } from "../layout/LoggedArea";
import Modal from "../utilities/Modal";
import TaskService from "../../services/TaskService";
import ClassroomService from "../../services/ClassroomService";
import AnswerTaskService from "../../services/AnswerTaskService";
import {
  showLoadingSpinner,
  hideLoadingSpinner,
  useNotification,
} from "../App";

const ReactQuill = dynamic(() => import("./../utilities/ReactQuill"), {
  ssr: false,
});

const TaskComponent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [answerContent, setAnswerContent] = useState({});
  const [classroomData, setClassroomData] = useState([]);
  const [answerTaskForm, setAnswerTaskForm] = useState({});
  const [answerListData, setAnswerListData] = useState([]);
  const [openAnswerLists, setOpenAnswerLists] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");

  console.log(answerListData);

  const isMobile = useMediaQuery({ maxWidth: 950 });
  const notification = useNotification();
  const loggedUser = useSelector((state) => state.credentials.userLogin);

  const getClassroom = async () => {
    try {
      setLoading(true);
      const responseClassroom = await ClassroomService.getClassroom({
        token: useCookie("token"),
      });
      if (responseClassroom.data) {
        const data = responseClassroom.data.data;
        setClassroomData(data);
      }
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

  const getTask = async (classroomId) => {
    try {
      setLoading(true);
      const responseTask = await TaskService.getTask(
        { classroomId },
        {
          token: useCookie("token"),
        }
      );
      responseTask.data && setTaskData(responseTask.data.data);
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

  const getAnswerTask = async () => {
    try {
      setLoading(true);
      const responseTask = await AnswerTaskService.getAnswerTask(
        { taskId: answerContent.id },
        {
          token: useCookie("token"),
        }
      );
      responseTask.data && setAnswerListData(responseTask.data.data);
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

  const handleRegister = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        const response = await TaskService.register(
          { ...formData, classroomId: selectedClassroomId },
          {
            token: useCookie("token"),
          }
        );
        hideLoadingSpinner();
        notification.showNotification({
          message: `${response.data.message}`,
          type: "success",
          dismissTimeout: 3000,
        });
        setOpenTaskModal(false);
        getTask(selectedClassroomId);
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
        const update = await TaskService.update(formData, {
          token: useCookie("token"),
        });
        setOpenTaskModal(false);
        hideLoadingSpinner();
        notification.showNotification({
          message: `Successfully edit ${update.data.data.name}`,
          type: "success",
          dismissTimeout: 3000,
        });
        getTask(selectedClassroomId);
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
    [formData, selectedClassroomId]
  );

  const handleSubmitAnswer = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      try {
        showLoadingSpinner();
        await AnswerTaskService.create(
          {
            ...answerTaskForm,
            taskId: answerContent.id,
          },
          {
            token: useCookie("token"),
          }
        );
        setOpenTaskModal(false);
        hideLoadingSpinner();
        notification.showNotification({
          message: `Successfully answer task!`,
          type: "success",
          dismissTimeout: 3000,
        });
        getTask(loggedUser.classroomId);
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
    [answerTaskForm, answerContent, loggedUser]
  );

  const handleDelete = useCallback(
    async ({ rows }) => {
      try {
        if (confirm(`Are you sure delete ${rows.length}`) == true) {
          for (const row of rows) {
            await TaskService.delete(
              {
                id: row.id,
              },
              {
                token: useCookie("token"),
              }
            );
          }
          getTask(selectedClassroomId);
          notification.showNotification({
            message: `Successfully delete ${rows.length} task!`,
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
    },
    [selectedClassroomId]
  );

  useEffect(() => {
    getClassroom();
    loggedUser &&
      loggedUser.role == "Student" &&
      getTask(loggedUser.classroomId);
  }, []);

  useEffect(() => {
    !openTaskModal && setFormData({});
    !openTaskModal && setAnswerContent({});
    !openTaskModal && setAnswerListData([]);
    !openTaskModal && setAnswerTaskForm({});
  }, [openTaskModal]);

  useEffect(() => {
    if (selectedClassroomId) getTask(selectedClassroomId);
    else setTaskData([]);
  }, [selectedClassroomId]);

  useEffect(() => {
    if (openAnswerLists) {
      getAnswerTask();
    } else {
      setAnswerContent({});
    }
  }, [openAnswerLists]);

  const columns = useMemo(
    () => [
      {
        Header: "Judul Tugas",
        accessor: "name",
      },
      {
        Header: "Mata Pelajaran",
        accessor: "mapel",
      },
      {
        Header: "Tanggal Dibuat",
        accessor: "_createdAt",
        Cell: (props) => {
          return (
            <div>
              <p>{moment(props.cell.row.original).format("LL")}</p>
            </div>
          );
        },
      },
    ],
    []
  );

  const modalTitle = () => {
    if (loggedUser && loggedUser.role == "Teacher")
      return !formData.id ? "Tambahkan tugas" : "Update tugas";
    else return "Kerjakan Tugas";
  };

  return (
    <LoggedArea>
      <Layout header={{ title: "Daftar Tugas" }}>
        <div tw="py-10">
          {loggedUser && loggedUser.role == "Teacher" && (
            <div tw="w-[50%] sm:w-[30%] -mb-10">
              <label
                htmlFor="password"
                tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Pilih Kelas
              </label>
              <select
                required
                onChange={(e) => {
                  if (e.target.value)
                    setSelectedClassroomId(
                      e.target.value != "null" ? e.target.value : ""
                    );
                }}
                tw="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              >
                <option value="null">Pilih Kelas Dulu</option>
                {classroomData.map((classroom, i) => {
                  return (
                    <option value={classroom.id} key={i}>
                      {classroom.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
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
                    setOpenTaskModal(true);
                  }
                : false
            }
            onAnswer={
              loggedUser != null && loggedUser.role === "Student"
                ? ({ row }) => {
                    setAnswerContent({
                      ...row,
                    });
                    setOpenTaskModal(true);
                  }
                : false
            }
            onAnswerList={
              loggedUser != null && loggedUser.role === "Teacher"
                ? ({ row }) => {
                    setAnswerContent({
                      ...row,
                    });
                    setOpenAnswerLists(true);
                  }
                : false
            }
            data={taskData}
            customTopButton={
              loggedUser != null && loggedUser.role === "Teacher" ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenTaskModal(true);
                  }}
                  className="h-9 w-9 text-white bg-gray-600 rounded-full shadow focus:outline-none mr-2"
                  disabled={!Boolean(selectedClassroomId) ? true : false}
                >
                  <i className="fa fa-plus"></i>
                </button>
              ) : (
                false
              )
            }
          />

          {/**
           * Answer Lists Modal
           */}

          <Modal
            modalOpen={openAnswerLists}
            setModalOpen={setOpenAnswerLists}
            customStyles={{
              "max-width": isMobile ? "28rem" : "38rem",
            }}
            modalTitle={'Daftar siswa yang mengerjakan'}
          >
            <div tw="ml-2 mt-2 h-[300px]">
              {answerListData.map((list, i) => {
                return (
                  <a
                    key={i}
                    tw="hover:bg-gray-100 dark:hover:bg-shark-500 px-5 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-300 transition duration-500 ease-in-out"
                  >
                    <img
                      tw="h-12 w-12 rounded-full object-cover mt-3"
                      src="/images/user.png"
                      alt="username"
                    />
                    <div tw="w-full py-2">
                      <div tw="flex justify-between">
                        <span tw="block ml-4 font-semibold text-base text-gray-600 dark:text-mystic-500">
                          {list.user[0].fullname}
                        </span>
                        <span tw="block ml-4 text-xl -mb-5 font-bold mt-1 text-gray-600 dark:text-mystic-500">
                          <i className="fa-solid fa-user"></i>
                        </span>
                      </div>
                      <span tw="block ml-4 text-gray-700 dark:text-mystic-500 w-[200px] truncate">
                        {list.user[0]._id}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </Modal>

          {/**
           * CRUD Modal
           */}

          <Modal
            modalOpen={openTaskModal}
            setModalOpen={setOpenTaskModal}
            customStyles={{
              "max-width": isMobile ? "28rem" : "38rem",
            }}
            modalTitle={modalTitle()}
            onSubmit={(() => {
              if (loggedUser && loggedUser.role === "Teacher") {
                return !formData.id ? handleRegister : handleUpdate;
              }
              return handleSubmitAnswer;
            })()}
            formElement={() => (
              <>
                {loggedUser.role === "Teacher" ? (
                  <>
                    <div>
                      <label
                        htmlFor="text"
                        tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Judul Tugas
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
                        placeholder="Judul Tugas"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="text"
                        tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Mata Pelajaran
                      </label>
                      <input
                        type="text"
                        name="text"
                        value={formData.mapel || ""}
                        onChange={(e) => {
                          if (e) e.preventDefault();
                          setFormData({
                            ...formData,
                            mapel: e.target.value,
                          });
                        }}
                        tw="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Mata Pelajaran"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>{ReactHtmlParser(answerContent.content)}</div>
                )}
                <div>
                  <label
                    htmlFor="text"
                    tw="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {loggedUser === "Teacher"
                      ? "Konten Tugas"
                      : "Kerjakan Tugas"}
                  </label>
                  <ReactQuill
                    onChange={(value) => {
                      if (loggedUser && loggedUser.role == "Teacher") {
                        setFormData({
                          ...formData,
                          content: value,
                        });
                      }
                      setAnswerTaskForm({
                        answerTaskForm,
                        content: value,
                      });
                    }}
                    value={(() => {
                      if (loggedUser && loggedUser.role == "Teacher") {
                        return formData.content || "";
                      }
                      return answerTaskForm.content || "";
                    })()}
                  />
                </div>
                <button
                  type="submit"
                  tw="w-full text-white bg-cornflower-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {(() => {
                    if (loggedUser && loggedUser.role == "Teacher") {
                      return !formData.id ? "Tambah Tugas" : "Update Tugas";
                    }
                    return "Update Jawaban";
                  })()}
                </button>
              </>
            )}
          />
        </div>
      </Layout>
    </LoggedArea>
  );
};

export default TaskComponent;
