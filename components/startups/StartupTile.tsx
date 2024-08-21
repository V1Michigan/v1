/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState, useEffect } from "react";
import {
  InformationCircleIcon,
  ExternalLinkIcon,
  HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import useSupabase from "../../hooks/useSupabase";
import { Project, Startup } from "../../utils/types";
import StartupProfileTile from "./StartupProfileTile";

interface Favorite {
  user_id: string;
  startup_id: number;
}

export default function StartupTile({ startup }: { startup: Startup }) {
  const {
    name,
    description,
    logo,
    website,
    industries,
    profiles,
    startups_members: profileMetadata,
  } = startup;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const { supabase, user } = useSupabase();

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) {
        return;
      }

      const { data } = await supabase
        .from<Favorite>("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("startup_id", startup.id)
        .single();

      if (data) {
        setIsFavorite(true);
      }
    };

    const fetchProjects = async () => {
      const { data } = await supabase
        .from<Project>("projects")
        .select("*")
        .eq("startup_id", startup.id);

      if (data) {
        setProjects(data);
      }
    };

    checkIfFavorite();
    fetchProjects();
  }, [user, supabase, startup.id]);

  const toggleFavorite = async () => {
    if (!user) {
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("startup_id", startup.id);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_id: user.id, startup_id: startup.id }]);

      if (!error) {
        setIsFavorite(true);
      }
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-white font-bold p-6 leading-none text-gray-800 uppercase rounded-lg shadow-lg duration-100 border border-stone-300 cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <img
          src={logo}
          className="w-1/2 mx-auto rounded-lg"
          alt={`${name} logo`}
        />

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
            <InformationCircleIcon className=" inline-block h-5 w-5" />
            <p className="inline-block">See More</p>
          </button>

          <button
            type="button"
            style={{ width: "calc(50% - 6px)" }}
            className="rounded-lg p-2 font-inter text-sm leading-5 tracking-normal text-left text-gray-600 bg-gray-300 flex justify-center"
          >
            <a
              href={website}
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
                  <div className="relative flex flex-col gap-y-4">
                    <div className="flex gap-x-8">
                      <img
                        src={logo}
                        className="w-48 rounded-lg"
                        alt={`${name} logo`}
                      />
                      <div className="flex flex-col gap-y-4">
                        <div className="flex gap-3">
                          <h1 className="text-4xl font-bold text-gray-900">
                            {name}
                          </h1>
                          <button
                            type="button"
                            onClick={toggleFavorite}
                            className="hover:scale-110 transition-transform duration-200 focus:outline-none"
                          >
                            {isFavorite ? (
                              <HeartFilledIcon className="w-7 h-7 text-red-500" />
                            ) : (
                              <HeartOutlineIcon className="w-7 h-7 text-gray-500 stroke-[1.5px]" />
                            )}
                          </button>
                        </div>

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
                      <div className="flex">
                        {industries?.map((industry) => (
                          <p className="text-sm my-2 mr-1 px-2 bg-slate-300 rounded-xl">
                            {industry}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-lg mb-2">
                        People
                      </span>
                      <div className="grid grid-cols-4 justify-between">
                        {profiles?.map((profile, i) => (
                          <StartupProfileTile
                            startupProfile={profile}
                            startupProfileMetadata={profileMetadata[i]}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-lg mb-2">
                        Projects
                      </span>
                      <div className="grid grid-cols-2 justify-between gap-4">
                        {projects?.map((project) => (
                          <div
                            key={project.id}
                            className=" bg-gray-100 rounded-lg flex flex-col gap-y-1 p-3"
                          >
                            <p className="text-sm text-gray-900">
                              {project.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {project.description}
                            </p>
                          </div>
                        ))}
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
