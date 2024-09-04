import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import InternalLink from "./Link";
import ProjectTile from "./projects/ProjectTile";
import { Project, Startup } from "../utils/types";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const ProjectLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [cohort, setCohort] = useState<string>("");
  const [studentStatus, setStudentStatus] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      setDataFetchErrors([]);
      const { data: projects2, error: dbError, status } = await supabase.from("projects").select("*");
      setProjects(projects2);
    };
    fetchProjectData();
  }, []);

  return (
    <>
      <div className="w-full bg-white px-52 h-[15rem] flex justify-center  flex-col gap-3">
        <div className="text-6xl font-black">V1 Community Projects</div>
      </div>
      <div className="w-full p-4 md:p-8 md:px-52 flex flex-col items-center bg-[#F8F7FA] min-h-[92vh]">
        <div className="max-w-screen-2xl relative w-full">
          <h1 className="text-2xl font-bold">What The Community&#39;s Built</h1>
          {/* <div className="flex flex-col items-center max-w-screen-2xl w-full static">
            <div className="w-full rounded-2xl text-black flex flex-col items-center gap-y-4">
              <InternalLink href="projects/upload">
                <button
                  type="button"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:opacity-75 hover:shadow-lg text-gray-100 text-lg font-semibold py-2.5 px-6 transition duration-300 rounded-lg shadow"
                >
                  Add your project!
                </button>
              </InternalLink>
            </div>
          </div> */}
          <div className="flex items-center justify-between mt-4">
            <div className="gap-2 flex w-[40%]">
              <input
                placeholder="Search for projects"
                className="px-2 rounded-md border-[1px] border-stone-300 h-10 w-full"
              />
              <button type="button" className="bg-blue-500 text-white px-2 rounded-sm">
                Search
              </button>
            </div>
            <div className="">
              <InternalLink href="projects/upload">
                <button
                  type="button"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:opacity-75 hover:shadow-lg text-gray-100 text-md font-semibold py-2.5 px-6 transition duration-300 rounded-lg shadow"
                >
                  Add your project!
                </button>
              </InternalLink>
            </div>
          </div>
        </div>
        <div className="w-full max-w-screen-2xl grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 pt-4">
          {projects?.map((project) => (
            <ProjectTile project={project} key={project.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectLayout;
