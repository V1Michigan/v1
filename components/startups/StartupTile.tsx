/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from "react";
import {
  InformationCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Startup } from "../../utils/types";

export default function StartupTile({ startup }: { startup: Startup }) {
  const { name, description, logo, website } = startup;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col bg-white font-bold p-6 leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <img src={logo} className="w-1/2 mx-auto rounded-lg" alt="logo" />

        <div className="mt-6 mx-auto text-center">
          <h1 className="normal-case text-xl font-semibold leading-6">
            {name}
          </h1>
        </div>

        <p
          style={{
            height: "60px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="normal-case text-base font-normal leading-5 tracking-normal text-left mt-3 text-gray-500"
        >
          {description}
        </p>

        <div className="flex mt-4 justify-between items-center">
          <button
            type="button"
            style={{
              backgroundColor: "#212936",
              width: "calc(50% - 6px)",
            }}
            className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-200 flex justify-center"
          >
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row m-auto items-center gap-1"
            >
              <InformationCircleIcon className=" inline-block h-5 w-5" />
              <p className="inline-block">See More</p>
            </a>
          </button>

          <button
            type="button"
            style={{ width: "calc(50% - 6px)" }}
            className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 flex justify-center"
          >
            <a
              href={website}
              className="flex flex-row m-auto items-center gap-1"
            >
              <ExternalLinkIcon className=" inline-block h-5 w-5" />
              <p className="inline-block">Website</p>
            </a>
          </button>
        </div>
      </div>
      <Transition appear show={dialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-y-4">
                    <div className="flex gap-x-8">
                      <img src={logo} className="w-48 rounded-lg" alt="logo" />
                      <div className="flex flex-col gap-y-4">
                        <h1 className="text-4xl font-bold text-gray-900">
                          {name}
                        </h1>
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-row items-center gap-1 text-gray-500"
                        >
                          <ExternalLinkIcon className=" inline-block h-5 w-5" />
                          <p className="inline-block underline">Website</p>
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
