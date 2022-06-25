import React, { useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import tw from "twin.macro";
import appConfig from "../../app.json";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, header }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userLogin = useSelector((state) => state.credentials.userLogin);

  return (
    <React.Fragment>
      <Head>
        <title>Home | {appConfig.name}</title>
      </Head>
      <div tw="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content area */}
        <div tw="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/*  Site header */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            userLogin={userLogin}
            title={header.title}
          />
          <main tw="bg-alabaster-500">
            <div tw="h-screen px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
