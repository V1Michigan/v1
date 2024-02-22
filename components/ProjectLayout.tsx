import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import InternalLink from "./Link";
import ProjectTile from "./projects/ProjectTile";
import { Startup } from "../utils/types";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

const ProjectLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;
  const [projects, setProjects] = useState<Startup[] | null>(null);
  const [cohort, setCohort] = useState<string>("");
  const [studentStatus, setStudentStatus] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchStartups = async () => {
      const { data } = await supabase
        .from("startups")
        .select(
          // This is necessary due to Supabase's API formatting requirements.
          // eslint-disable-next-line quotes
          `*, profiles!startups_members (username, name), startups_members (role, headshot_src)`
        )
        .eq("is_project", true)
        .order("user_id", { foreignTable: "startups_members" }); // To make sure roles are applied in the right order
      setProjects(data);
    };
    fetchStartups();
  }, []);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center bg-gray-50">
      <div className="max-w-screen-2xl relative w-full">
        <div className="flex flex-col items-center max-w-screen-2xl w-full static">
          <div className="w-full rounded-2xl text-black flex flex-col items-center gap-y-4">
            <h1 className="font-bold text-5xl mt-2 text-center">{title}</h1>
            <h3 className="font-regular text-lg text-center">
              {directoryDescription}
            </h3>
            <InternalLink href="http://www.google.com">
              <button
                type="button"
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:opacity-75 hover:shadow-lg text-gray-100 text-lg font-semibold py-2.5 px-6 transition duration-300 rounded-lg shadow"
              >
                Add your project!
              </button>
            </InternalLink>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <select
          className="bg-gray-200 border-none rounded-md w-48 text-sm "
          value={cohort}
          onChange={(e) => setCohort(e.target.value)}
        >
          <option value="">Cohort</option>
          <option value="W23">W23</option>
          <option value="F23">F23</option>
          <option value="W24">W24</option>
        </select>

        <select
          className=" bg-gray-200 border-none rounded-md w-32 text-sm "
          value={studentStatus}
          onChange={(e) => setStudentStatus(e.target.value)}
        >
          <option value="">Role</option>
          <option value="currentStudent">Student</option>
          <option value="alumni">Alumni</option>
        </select>

        <select
          className="bg-gray-200 border-none rounded-md w-48 text-sm"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
        >
          <option value="">Type</option>
          <option value="Mobile App">Mobile App</option>
          <option value="Web">Web</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Game Development">Game Development</option>
        </select>

        <form
          className="flex items-center max-w-sm gap-x-2"
          onSubmit={() => console.log("search")}
        >
          <div className="relative w-full">
            <input
              type="text"
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="p-2.5 ms-2 text-sm font-medium text-white bg-yellow-600 rounded-lg border border-gray-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>
      <div className="w-full max-w-screen-2xl mt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 pt-2">
        {projects?.map((project) => (
          <ProjectTile project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
};

export default ProjectLayout;
