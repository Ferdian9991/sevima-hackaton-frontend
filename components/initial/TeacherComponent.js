import React from "react";
import tw from "twin.macro";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import Table from "../utilities/Table";

const allData = [
  {
    name: "Alex",
    fullname: "Alex Budiman",
    grade: "A++",
    class: "Professional",
  },
  {
    name: "Shrek",
    fullname: "Iwan Shrek",
    grade: "A++",
    class: "Professional",
  },
  {
    name: "Livia",
    fullname: "Olivia",
    grade: "A++",
    class: "Master",
  },
];

const TeacherComponent = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Username",
        accessor: "name",
      },
      {
        Header: "Fullname",
        accessor: "fullname",
      },
      {
        Header: "User Grade",
        accessor: "grade",
      },
      {
        Header: "Classes",
        accessor: "class",
      },
    ],
    []
  );
  return (
    <LoggedArea>
      <Layout header={{ title: "Data Guru" }}>
        <div tw="py-10">
          <Table
            onRemove={() => {}}
            columns={columns}
            onEdit={({ row }) => {
              setFormData({
                ...row,
              });
              setAddDeviceModalOpen(true);
            }}
            data={allData}
            customTopButton={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddDeviceModalOpen(true);
                }}
                className="h-9 w-9 text-white bg-gray-600 rounded-full shadow focus:outline-none mr-2"
              >
                <i className="fa fa-plus"></i>
              </button>
            }
          />
        </div>
      </Layout>
    </LoggedArea>
  );
};

export default TeacherComponent;
