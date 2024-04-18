/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from "react";
import {
  DesktopComputerIcon,
  CodeIcon,
  InformationCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import ProjectProfileTile from "./ProjectProfileTile";
import { Project } from "../../utils/types";

export default function ProjectTile({ project }: { project: Project }) {
  const { name, description, logo, link, type } = project;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        className="max-w-[25rem] flex flex-col bg-white font-bold p-6 leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex items-center justify-center gap-2">
          <img
            src="/v1_logo_gold.png"
            className="w-10 h-10 rounded-lg"
            alt={`${name} logo`}
          />

          <div className="text-center">
            <h1 className="normal-case text-xl font-semibold leading-6">
              {name}
            </h1>
          </div>
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
            <InformationCircleIcon className=" inline-block h-5 w-5" />
            <p className="inline-block">See More</p>
          </button>

          <button
            type="button"
            style={{ width: "calc(50% - 6px)" }}
            className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 flex justify-center"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row m-auto items-center gap-1"
            >
              <ExternalLinkIcon className=" inline-block h-5 w-5" />
              <p className="inline-block">Website</p>
            </a>
          </button>
        </div>
      </div>
      {/* <Transition appear show={dialogOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col">
                    <img
                      src={logo}
                      className="h-64 rounded-lg self-center"
                      alt={`${name} logo`}
                    />

                    <div className="flex flex-row mt-6">
                      <h1 className="text-5xl font-bold text-gray-900 mr-4">
                        {name}
                      </h1>
                    </div>

                    <div className="flex flex-col gap-y-4 mt-4">
                      <div>
                        <p className="text-xl font-medium">Problem Statement</p>
                        <p className="text-base text-gray-600">
                          Id consectetur purus ut faucibus. Et pharetra pharetra
                          massa massa ultricies. Felis donec et odio
                          pellentesque diam volutpat commodo sed.
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-medium">Description</p>
                        <p className="text-base text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </>
  );
}
