import React, { useState, useRef, useEffect } from "react";
import tw from "twin.macro";
import Link from "next/link";
import _ from "lodash";
import Transition from "./Transition";
import UserAvatar from "../../public/images/user.png";

const UserMenu = ({ userLogin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div tw="relative inline-flex">
      <button
        ref={trigger}
        className="group"
        tw="inline-flex justify-center items-center"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          tw="w-8 h-8 rounded-full"
          src={UserAvatar.src}
          width="32"
          height="32"
          alt="User"
        />
        <div tw="flex items-center truncate">
          <span tw="w-16 truncate ml-2 text-sm font-medium group-hover:text-gray-800">
            {_.capitalize(userLogin.username)}
          </span>
          <svg
            tw="w-3 h-3 flex-shrink-0 ml-1 fill-current text-gray-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        tw="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div tw="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200">
            <div tw="font-medium text-gray-800">
              {_.capitalize(userLogin.username)}
            </div>
            <div tw="text-xs text-gray-500 italic">Administrator</div>
          </div>
          <ul>
            <li>
              <Link href="/">
                <div
                  tw="font-medium cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center py-1 px-3"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Settings
                </div>
              </Link>
            </li>
            <li>
              <Link href="/logout">
                <div
                  tw="font-medium cursor-pointer text-sm text-red-500 hover:text-red-700 flex items-center py-1 px-3"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Log Out
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default UserMenu;
