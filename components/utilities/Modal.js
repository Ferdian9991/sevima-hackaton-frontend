import React, { useRef, useEffect } from "react";
import tw, { css } from "twin.macro";
import Transition from "./Transition";

const Modal = ({
  children,
  customStyles,
  modalOpen,
  setModalOpen,
  formElement,
  onSubmit,
  modalTitle,
}) => {
  const modalContent = useRef(null);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <Transition
      tw="fixed inset-0 z-50 overflow-hidden flex items-start mb-4 justify-center px-4 sm:px-6"
      show={modalOpen}
      enter="transform transition ease-in-out duration-300"
      enterStart="opacity-0 translate-y-64"
      enterEnd="opacity-100 translate-y-0"
      leave="transform transition ease-in-out duration-300"
      leaveStart="opacity-100 translate-y-0"
      leaveEnd="opacity-0 translate-y-64"
    >
      <div
        ref={modalContent}
        tw="overflow-hidden fixed top-0 right-0 left-0 z-50 w-full h-full md:inset-0"
        css={{ backgroundColor: "#ffffff78" }}
      >
        {modalOpen && (
          <div
            tw="relative block mx-auto p-4 w-full max-w-md top-20 h-full md:h-auto"
            css={customStyles && customStyles}
          >
            <div tw="relative bg-white rounded-lg shadow">
              <button
                type="button"
                onClick={(e) => {
                  if (e) e.preventDefault();
                  setModalOpen(false);
                }}
                tw="absolute top-6 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg
                  tw="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div tw="py-6 border-2 border-gray-300 rounded-lg">
                <h3 tw="mb-4 px-6 text-xl font-medium text-gray-900 dark:text-white">
                  {modalTitle}
                </h3>
                <div tw="max-h-[350px] overflow-y-auto">
                  {formElement && (
                    <form
                      tw="space-y-6 px-6"
                      onSubmit={onSubmit ? onSubmit : () => {}}
                    >
                      {formElement()}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
};

export default Modal;
