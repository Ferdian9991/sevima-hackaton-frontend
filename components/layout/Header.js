import React, { useState } from "react";
import tw, { css } from "twin.macro";
import SearchModal from "../utilities/SearchModal";
import UserMenu from "../utilities/UserMenu";

const Header = ({ sidebarOpen, setSidebarOpen, userLogin, title }) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <header tw="sticky top-0 z-30 shadow-md">
      <div tw="px-4 bg-cornflower-blue-100 sm:px-6 lg:px-8">
        <div tw="flex items-center justify-between h-16 -mb-px">
          <div tw="flex">
            <button
              tw="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span tw="sr-only">Open sidebar</span>
              <svg
                tw="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          <h2 tw="text-lg font-poppins text-gray-500 font-bold flex-1 pl-4">
            {title}
          </h2>

          <div tw="flex items-center">
            <button
              tw="w-8 h-8 flex items-center justify-center bg-blue-100 hover:bg-blue-200 transition duration-150 rounded-full ml-3"
              css={[searchModalOpen && tw`bg-blue-200`]}
              onClick={(e) => {
                e.stopPropagation();
                setSearchModalOpen(true);
              }}
              aria-controls="search-modal"
            >
              <span tw="sr-only">Search</span>
              <i tw="w-4 h-4 text-blue-500" className="fa fa-search"></i>
            </button>
            <SearchModal
              id="search-modal"
              searchId="search"
              modalOpen={searchModalOpen}
              setModalOpen={setSearchModalOpen}
            />
            <hr tw="w-px h-6 bg-gray-200 mx-3" />
            <UserMenu userLogin={userLogin} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
