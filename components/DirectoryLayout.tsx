import { useState, useEffect, Fragment } from "react";
import supabase from "../utils/supabaseClient";
import StartupTile from "./startups/StartupTile";
import { Startup } from "../utils/types";
import { Tab } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { useQuery } from "react-query";
import ProjectTile from "./projects/ProjectTile";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const DirectoryLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;

  const fetchStartups = async () => {
    const { data } = await supabase
      .from("startups")
      .select(
        // This is necessary due to Supabase's API formatting requirements.
        // eslint-disable-next-line quotes
        `*, profiles!startups_members (username, name, email), startups_members (role, headshot_src)`
      )
      .order("user_id", { foreignTable: "startups_members" }); // To make sure roles are applied in the right order
    console.log(data);
    return data;
  };

  const startupsQuery = useQuery({
    queryKey: ["startups"],
    queryFn: fetchStartups,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select(
      // This is necessary due to Supabase's API formatting requirements.
      // eslint-disable-next-line quotes
      `*, profiles!projects_members (id, username, name, email)`
    );
    // .order("user_id", { foreignTable: "projects_members" }); // To make sure roles are applied in the right order
    console.log("Project data:");
    console.log(data);
    return data;
  };

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <div className="w-full p-4 md:p-16 flex gap-8 flex-col">
      <div className="max-w-screen-2xl relative w-full">
        <h1 className="text-5xl font-figtree font-sans font-semibold">The Directory</h1>
      </div>
      <Tab.Group>
        <Tab.List className="max-w-md flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              twMerge(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected ? "bg-white text-blue-700 shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Startups
          </Tab>
          <Tab
            className={({ selected }) =>
              twMerge(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected ? "bg-white text-blue-700 shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Projects
          </Tab>
        </Tab.List>
        <Tab.Panels className="">
          <Tab.Panel
            className={twMerge(
              "rounded-xl bg-white",
              "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none"
            )}
          >
            <div className="w-full grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {startupsQuery.data?.map((startup) => (
                <StartupTile startup={startup} key={startup.id} />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel className={twMerge("rounded-xl bg-white p-3", "focus:outline-none")}>
            <div className="w-full max-w-screen-2xl grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-[36px]">
              {projectsQuery.data?.map((project) => (
                <ProjectTile project={project} key={project.id} />
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="w-full max-w-screen-2xl mt-8 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4"></div>
    </div>
  );
};

export default DirectoryLayout;
