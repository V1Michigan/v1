/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  DesktopComputerIcon,
  CodeIcon,
  InformationCircleIcon,
  ExternalLinkIcon,
  HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/solid";
import { useQuery } from "react-query";
import ProjectProfileTile from "./ProjectProfileTile";
import { Project } from "../../utils/types";
import useSupabase from "../../hooks/useSupabase";
import StartupProfileTile from "../startups/StartupProfileTile";

interface Favorite {
  user_id: string;
  project_id: number;
}

export default function ProjectTile({ project }: { project: Project }) {
  const { name, description, link, categories } = project;
  const [dialogOpen, setDialogOpen] = useState(false);
  const { supabase, user } = useSupabase();
  // const [logo, setLogo] = useState<File | undefined>();
  type Avatars = Record<string, string>;

  // const [avatars, setAvatars] = useState<Avatars>({});
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) {
        return;
      }

      const { data } = await supabase
        .from<Favorite>("project_favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .single();

      if (data) {
        setIsFavorite(true);
      }
    };

    checkIfFavorite();
  }, [user, supabase, project.id]);

  const toggleFavorite = async () => {
    if (!user) {
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("project_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("project_id", project.id);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from("project_favorites")
        .insert([{ user_id: user.id, project_id: project.id }]);

      if (!error) {
        setIsFavorite(true);
      }
    }
  };
  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  const downloadImages = async () => {
    try {
      const urls: Record<string, string> = {};
      for (const projectMember of project.profiles) {
        // eslint-disable-next-line no-await-in-loop
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(projectMember.id);

        if (error) {
          console.error("Error downloading image");
          return;
        }
        const url = URL.createObjectURL(data as Blob);
        urls[projectMember.id] = url;
      }
      // eslint-disable-next-line consistent-return
      return urls;
    } catch (err) {
      console.error("Error in downloadImages:", err);
    }
  };
  const imagesQuery = useQuery({
    queryKey: ["projects", `${project.id}`, "images"],
    queryFn: downloadImages,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <li
        onClick={() => setDialogOpen(true)}
        className="m-0 p-0 list-none rounded-md"
      >
        <div className="border border-0.5 relative h-0 pb-[75%] overflow-hidden rounded-md group">
          <div className="flex items-center justify-center">
            <img
              src={project.logo_url}
              className="w-[400px] h-[250px] mt-auto rounded-lg rounded-b-sm object-contain object-center"
              alt={`${name} logo`}
            />
          </div>
          <div className="flex z-[2] items-end p-[20px] rounded-md absolute bg-gradient-to-b from-transparent to-gray-50/10 hover:bg-black/80 hover:opacity-1 top-0 bottom-0 left-0 right-0">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-1 items-center justify-between min-w-0">
              <div className="">
                <h1 className="font-figtree text-white text-md font-semibold font-sans overflow-hidden">
                  {project.name}
                </h1>
                <h3
                  style={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "3",
                  }}
                  className="font-figtree text-white text-sm font-medium"
                >
                  {project.description}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center mt-2">
          <div className="inline-flex">
            {imagesQuery?.data &&
              Object.entries(imagesQuery?.data).map(
                ([key, value]: [string, string]) => (
                  <span className="avatar rounded-full relative border-[2px] border-[#F8F8F8] w-[30px] overflow-hidden">
                    <img className="w-full block" src={value} alt="temp" />
                  </span>
                )
              )}
          </div>
          <h1 className="text-black font-md font-figtree font-semibold">
            {project.name}
          </h1>
          <button
            type="button"
            onClick={toggleFavorite}
            className="hover:scale-110 transition-transform duration-200 focus:outline-none ml-auto"
          >
            {user ? (
              <>
                {isFavorite ? (
                  <HeartFilledIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="w-5 h-5 text-gray-500 stroke-[1.5px]" />
                )}
              </>
            ) : (
              ""
            )}
          </button>
        </div>
      </li>
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
                        src={project.logo_url}
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
                            {user ? (
                              <>
                                {isFavorite ? (
                                  <HeartFilledIcon className="w-5 h-5 text-red-500" />
                                ) : (
                                  <HeartOutlineIcon className="w-5 h-5 text-gray-500 stroke-[1.5px]" />
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </button>
                        </div>

                        <a
                          href={project.link}
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
                        {project?.categories?.map((category) => (
                          <p className="text-sm my-2 mr-1 px-2 bg-slate-300 rounded-xl">
                            {category}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-lg mb-2">
                        People
                      </span>
                      <div className="grid grid-cols-4 justify-between">
                        {project.profiles?.map((profile, i) => (
                          <ProjectProfileTile
                            projectProfile={profile}
                            headshotSrc={
                              imagesQuery?.data?.[profile.id]
                                ? imagesQuery?.data?.[profile.id]
                                : anonymousPersonImage
                            }
                          />
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
