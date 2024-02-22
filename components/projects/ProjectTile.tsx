/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from "react";
import { DesktopComputerIcon, CodeIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import ProjectProfileTile from "./ProjectProfileTile";
import { Startup } from "../../utils/types";

export default function ProjectTile({ project }: { project: Startup }) {
  const {
    name,
    description,
    logo,
    tech,
    website,
    profiles,
    github,
    startups_members: profileMetadata,
  } = project;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col bg-white font-bold p-6 leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <img
          src={logo}
          className="h-48 mx-auto border border-slate-300 rounded-lg"
          alt={`${name} logo`}
        />

        <div className="mt-6 mx-auto text-center">
          <h1 className="normal-case text-2xl font-semibold leading-6">
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
                      <div className="flex flex-row gap-x-3 items-center">
                        {website && (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row text-gray-600 w-6 h-6"
                          >
                            <DesktopComputerIcon className="inline-block h-full" />
                          </a>
                        )}
                        {github && (
                          <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row text-gray-600 w-6 h-6"
                          >
                            <CodeIcon className="inline-block h-full" />
                          </a>
                        )}
                      </div>
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
                      <div>
                        <p className="text-xl font-medium">Technologies</p>
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                          {tech?.map((item) => (
                            <p
                              key={item}
                              className={`text-base text-gray-600 ${
                                item !== tech[tech.length - 1]
                                  ? "border-r-[1.5px] border-gray-300 pr-2"
                                  : ""
                              }`}
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xl font-medium">Our Builders</p>
                        <div className="mt-4 grid grid-cols-4 gap-x-4 gap-y-3">
                          {profiles?.map((profile, i) => (
                            <ProjectProfileTile
                              projectProfile={profile}
                              projectProfileMetadata={profileMetadata[i]}
                            />
                          ))}
                          {profiles?.map((profile, i) => (
                            <ProjectProfileTile
                              projectProfile={profile}
                              projectProfileMetadata={profileMetadata[i]}
                            />
                          ))}
                        </div>
                      </div>
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
