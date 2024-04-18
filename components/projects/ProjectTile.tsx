/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  DesktopComputerIcon,
  CodeIcon,
  InformationCircleIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import ProjectProfileTile from "./ProjectProfileTile";
import { Project } from "../../utils/types";
import useSupabase from "../../hooks/useSupabase";

export default function ProjectTile({ project }: { project: Project }) {
  const { name, description, link, categories } = project;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { supabase } = useSupabase();
  const [logo, setLogo] = useState<File | undefined>();
  const [avatars, setAvatars] = useState<string[]>();

  const downloadFromSupabase = useCallback(
    async (
      bucket: string,
      name2: string,
      filename: string,
      filetype: string | undefined = undefined
    ) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(name2);
      if (error) {
        return undefined;
      }
      if (!data) {
        return undefined;
      }
      return new File([data as BlobPart], filename, {
        type: filetype || data.type,
      });
    },
    [supabase]
  );

  useEffect(() => {
    const fetchImage = async () => {
      const [logo2, avatar3] = await Promise.all([
        downloadFromSupabase(
          "projects",
          `${project.id}`,
          `${project.name} avatar`
        ),
        downloadFromSupabase(
          "avatars",
          "14fcb822-497a-41f6-b9ee-2fe9a5d5491f",
          `${project.name} avatar`
        ),
      ]);
      setAvatars([
        "people/hchidam.jpg",
        "people/jai.png",
        avatar3 ? URL.createObjectURL(avatar3) : "people/jai.png",
      ]);
      setLogo(logo2);
    };
    fetchImage();
  }, [downloadFromSupabase, project.id, project.name]);

  return (
    <>
      <a
        className="w-full flex flex-col gap-4 bg-white font-bold leading-none text-gray-800 uppercase rounded-lg rounded-b-md hover:shadow-lg duration-100 border border-stone-300 cursor-pointer"
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center justify-center">
          <img
            src={logo ? URL.createObjectURL(logo) : "landing.jpg"}
            className="w-[512px] h-[210px] rounded-lg rounded-b-sm object-cover object-center"
            alt={`${name} logo`}
          />
        </div>
        <div className="pb-3 px-3 flex flex-col gap-1">
          <div className="inline-flex">
            {avatars?.map((avatar) => (
              <span className="avatar rounded-full relative border-[2px] border-[#F8F8F8] w-[30px] overflow-hidden">
                <img className="w-full block" src={avatar} alt="temp" />
              </span>
            ))}
          </div>
          <div className="flex items-center">
            <h2 className="text-left normal-case font-semibold font-inter text-xl leading-6">
              {name}
            </h2>
          </div>
          <div className="flex items-center">
            <p className="text-left normal-case font-normal font-inter text-sm leading-6 line-clamp-3">
              {description}
            </p>
          </div>
          <div className="project-tags flex gap-1">
            <div className="bg-[#EEEAFB] h-[24px] px-2 rounded-lg flex items-center">
              <h1 className="text-xs normal-case font-medium">{categories}</h1>
            </div>
          </div>
        </div>
      </a>
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
