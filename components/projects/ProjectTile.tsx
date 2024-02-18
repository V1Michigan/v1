/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from "react";
import { DesktopComputerIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import ProjectProfileTile from "./ProjectProfileTile";

type ProjectProfile = {
  name: string | null;
  username: string;
};

type ProjectProfileMetadata = {
  role: string;
  headshot_src: string;
};

type Project = {
  created_at: string;
  description: string;
  id: number;
  industries: string[];
  logo: string;
  name: string;
  project_members: ProjectProfileMetadata[];
  size: number;
  stage: string;
  tech: string[];
  website: string;
  profiles: ProjectProfile[];
};

export default function ProjectTile({ project }: { project: Project }) {
  const {
    name,
    description,
    logo,
    website,
    industries,
    profiles,
    project_members: profileMetadata,
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
          className="h-3/5 mx-auto border border-slate-300 rounded-lg"
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-y-4">
                    <img
                      src={logo}
                      className="max-h-56 rounded-lg self-center"
                      alt={`${name} logo`}
                    />

                    <div className="flex flex-row">
                      <h1 className="text-4xl font-bold text-gray-900 mr-4">
                        {name}
                      </h1>
                      <div className="flex flex-row gap-x-3 items-center">
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-row text-gray-500 w-6 h-6"
                        >
                          <DesktopComputerIcon className="inline-block h-full" />
                        </a>
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-row text-gray-500 w-6 h-6"
                        >
                          <DesktopComputerIcon className="inline-block h-full" />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-3">
                      <div>
                        <p className="font-medium">Description</p>
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>

                      <div>
                        <p className="font-medium">Technologies</p>
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>

                      <div>
                        <p className="font-medium">Our Builders</p>
                        <div className="flex flex-wrap mt-3">
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
