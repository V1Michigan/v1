import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Tab, Combobox } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { useQuery } from "react-query";
import supabase from "../utils/supabaseClient";
import StartupTile from "./startups/StartupTile";
import { Project, Startup } from "../utils/types";
import ProjectTile from "./projects/ProjectTile";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const DirectoryLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;
  const [projectSearchText, setProjectSearchText] = useState("");
  // const [selectedProjectCategory, setSelectedProjectCategory] = useState("");
  const [startupSearchText, setStartupSearchText] = useState("");

  const fetchStartups = async () => {
    const { data } = await supabase
      .from("startups")
      .select(
        // This is necessary due to Supabase's API formatting requirements.
        // eslint-disable-next-line quotes
        `*, profiles!startups_members (id, username, name, email, slack_deeplink), startups_members (role, headshot_src)`
      )
      .order("user_id", { foreignTable: "startups_members" }); // To make sure roles are applied in the right order
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
      `*, profiles!projects_members (id, username, name, email, slack_deeplink), projects_members (member_id)`
    );
    // .order("user_id", { foreignTable: "projects_members" }); // To make sure roles are applied in the right order
    return data;
  };

  const filteredStartups = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (!startupsQuery?.data) return [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return startupsQuery.data?.filter((project: Project) => {
      const matchesName = project.name
        .toLowerCase()
        .includes(startupSearchText.toLowerCase());

      // const matchesCategory = selectedProjectCategory === "" || project.category === selectedProjectCategory;

      return matchesName;
    });
  }, [startupsQuery.data, startupSearchText]);

  return (
    <div className="w-full p-4 md:p-16 flex gap-4 flex-col bg-gray-50">
      <div className="max-w-screen-2xl relative w-full">
        <h1 className="text-5xl font-figtree font-sans font-semibold mb-4">
          The Directory
        </h1>
      </div>
      <div className="flex flex-col">
        <input
          name="startupName"
          type="text"
          placeholder="Search by name"
          value={startupSearchText}
          onChange={(e) => setStartupSearchText(e.target.value)}
          className="flex h-10 w-64 rounded-md border border-slate-200 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="bg-gray-50 w-full grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredStartups?.map((startup: Startup) => (
          <React.Fragment key={startup.id}>
            <StartupTile startup={startup} key={startup.id} />
          </React.Fragment>
        ))}
      </div>
      {/* <Tab.Group>
        <Tab.List className="max-w-md flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              twMerge(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-black text-white shadow"
                  : "text-black hover:bg-white/[0.12] hover:text-white"
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
                selected
                  ? "bg-black text-white shadow"
                  : "text-black hover:bg-white/[0.12] hover:text-white"
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
            <div className="bg-gray-50 w-full grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {startupsQuery.data?.map((startup: Startup) => (
                <React.Fragment key={startup.id}>
                  <StartupTile startup={startup} key={startup.id} />
                </React.Fragment>
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel
            className={twMerge("rounded-xl p-3", "focus:outline-none")}
          >
            <div className="flex flex-col mb-4">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Search by name"
                value={projectSearchText}
                onChange={(e) => setProjectSearchText(e.target.value)}
                className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="bg-gray-50 w-full max-w-screen-2xl grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-[36px]">
              {filteredProjects?.map((project: Project) => (
                <React.Fragment key={project.id}>
                  <ProjectTile project={project} key={project.id} />
                </React.Fragment>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group> */}

      <div className="w-full max-w-screen-2xl mt-8 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4" />
    </div>
  );
};

export default DirectoryLayout;
