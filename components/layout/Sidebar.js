import React, { useState, useEffect, useRef } from "react";
import tw, { css } from "twin.macro";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import DashboardIcon from "../../public/images/dashboard.png";

const linkPathname = (router, link) => {
  let result = router.pathname.indexOf(link) >= 0;
  return result;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );

  const loggedUser = useSelector((state) => state.credentials.userLogin);

  const listMenu = [
    {
      link: "/home",
      icon: "fa fa-home",
      label: "Home",
      roles: ["Teacher", "Student"],
      isActive: linkPathname,
    },
    {
      link: "/classroom",
      icon: "fa-solid fa-graduation-cap",
      label: "Data Kelas",
      roles: ["Teacher"],
      isActive: linkPathname,
    },
    {
      link: "/teacher",
      icon: "fa-solid fa-chalkboard-user",
      label: "Daftar Guru",
      roles: ["Teacher", "Student"],
      isActive: linkPathname,
    },
    {
      link: "/student",
      icon: "fa-solid fa-user",
      label: "Daftar Siswa",
      roles: ["Teacher", "Student"],
      isActive: linkPathname,
    },
  ];

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      <div
        tw="fixed inset-0 bg-white bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200"
        css={[
          sidebarOpen ? tw`opacity-100` : tw`opacity-0 pointer-events-none`,
        ]}
        aria-hidden="true"
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        tw="bg-cornflower-blue-500 flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto 2xl:!w-64 flex-shrink-0 p-4 w-64 lg:w-20 h-screen overflow-y-auto lg:overflow-y-auto transform transition-all duration-200 ease-in-out lg:translate-x-0"
        className={`no-scrollbar lg:sidebar-expanded:!w-64`}
        css={{
          transform: sidebarOpen ? "translateX(0rem)" : "translateX(-16rem)",
        }}
      >
        <div tw="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            tw="lg:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span tw="sr-only">Close sidebar</span>
            <svg
              tw="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>

          <Link href="/">
            <div tw="block">
              <img src={DashboardIcon.src} width="32" height="32"></img>
            </div>
          </Link>
        </div>

        <div tw="space-y-8">
          <div>
            <h3 tw="text-xs uppercase text-white font-semibold pl-3">
              <span
                className="lg:sidebar-expanded:hidden"
                tw="hidden lg:block 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span
                className="lg:sidebar-expanded:block"
                tw="lg:hidden 2xl:block"
              >
                Menu
              </span>
            </h3>

            <ul tw="mt-3">
              {menuRenderer({ subMenu: listMenu, userRole: loggedUser.role })}
            </ul>
          </div>
        </div>

        <div tw="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div tw="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span tw="sr-only">Expand / collapse sidebar</span>
              <svg
                className="sidebar-expanded:rotate-180"
                tw="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path
                  tw="text-white"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path tw="text-white" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const menuRenderer = ({ subMenu, userRole }) => {
  const router = useRouter();
  return subMenu.map((menu, i) => {
    let active = menu.isActive && menu.isActive(router, menu.link);
    const filterRoles = menu.roles.filter((role) => role == userRole)[0];
    return (
      filterRoles && (
        <li
          key={i}
          tw="px-3 py-2 cursor-pointer rounded-sm mb-2 last:mb-0"
          css={[active && tw`bg-blue-100 rounded-lg`]}
        >
          <Link href={menu.link}>
            <div tw="block text-gray-200 hover:text-white truncate transition duration-150">
              <div tw="flex items-center">
                <i
                  className={menu.icon}
                  tw="flex-shrink-0 w-6 text-xl"
                  css={[active ? tw`text-blue-700` : tw`text-white`]}
                ></i>
                <span
                  className="lg:sidebar-expanded:opacity-100"
                  tw="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200"
                  css={[active ? tw`text-blue-700` : tw`text-white`]}
                >
                  {menu.label}
                </span>
              </div>
            </div>
          </Link>
        </li>
      )
    );
  });
};

export default Sidebar;
