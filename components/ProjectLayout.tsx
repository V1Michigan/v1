import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import ProjectTile from "./projects/ProjectTile";

type LayoutProps = {
  title: string;
  description: string;
  link: string;
};

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

const ProjectLayout = (props: LayoutProps) => {
  const { title, description: directoryDescription, link: _ } = props;

  //   const [projects, setProjects] = useState<Project[] | null>(null);
  const projects: Project[] = [
    {
      created_at: "2023-10-15",
      description: "A platform for online education with interactive features.",
      id: 1,
      industries: ["Education", "Technology"],
      logo: "https://example.com/logo1.png",
      name: "EduTechX",
      project_members: [
        { role: "Founder", headshot_src: "https://example.com/headshot1.png" },
        {
          role: "Lead Developer",
          headshot_src: "https://example.com/headshot2.png",
        },
        {
          role: "Marketing Manager",
          headshot_src: "https://example.com/headshot3.png",
        },
      ],
      size: 15,
      stage: "Development",
      tech: ["React", "Node.js", "MongoDB"],
      website: "https://edutechx.com",
      profiles: [
        { name: "John Doe", username: "johndoe" },
        { name: "Jane Smith", username: "janesmith" },
      ],
    },
    {
      created_at: "2023-08-21",
      description:
        "An e-commerce platform for handmade crafts and artisanal products.",
      id: 2,
      industries: ["Retail", "Crafts"],
      logo: "https://example.com/logo2.png",
      name: "Craftify",
      project_members: [
        {
          role: "Co-Founder",
          headshot_src: "https://example.com/headshot4.png",
        },
        {
          role: "Lead Designer",
          headshot_src: "https://example.com/headshot5.png",
        },
        {
          role: "Operations Manager",
          headshot_src: "https://example.com/headshot6.png",
        },
      ],
      size: 10,
      stage: "Launch",
      tech: ["Shopify", "WordPress", "Stripe"],
      website: "https://craftify.com",
      profiles: [
        { name: "Alice Johnson", username: "alicej" },
        { name: "Bob Green", username: "bobg" },
      ],
    },
    {
      created_at: "2023-12-05",
      description:
        "A social networking platform connecting professionals in the tech industry.",
      id: 3,
      industries: ["Technology", "Social Networking"],
      logo: "https://example.com/logo3.png",
      name: "TechConnect",
      project_members: [
        { role: "CEO", headshot_src: "https://example.com/headshot7.png" },
        {
          role: "Lead Engineer",
          headshot_src: "https://example.com/headshot8.png",
        },
        {
          role: "Community Manager",
          headshot_src: "https://example.com/headshot9.png",
        },
      ],
      size: 20,
      stage: "Growth",
      tech: ["Angular", "Java", "MySQL"],
      website: "https://techconnect.com",
      profiles: [
        { name: "Michael Brown", username: "michaelb" },
        { name: "Emma Lee", username: "emmal" },
      ],
    },
  ];

  //   useEffect(() => {
  //     const fetchProjects = async () => {
  //       const { data } = await supabase
  //         .from("projects")
  //         .select(
  //           // This is necessary due to Supabase's API formatting requirements.
  //           // eslint-disable-next-line quotes
  //           `*, profiles!startups_members (username, name), startups_members (role, headshot_src)`
  //         )
  //         .order("user_id", { foreignTable: "startups_members" }); // To make sure roles are applied in the right order
  //       setProjects(data);
  //     };
  //     fetchProjects();
  //   }, []);

  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center bg-gray-50">
      <div className="max-w-screen-2xl relative w-full">
        <div className=" flex flex-col items-center max-w-screen-2xl w-full static">
          <div className="w-full rounded-2xl p-16 bg-[url('/landing.jpg')]">
            <h1 className="font-bold text-white text-3xl mb-6">{title}</h1>
            <h3 className="font-regular text-white text-2xl mb-9">
              {directoryDescription}
            </h3>
            {/* <a href={link} target="_blank" rel="noreferrer">
              <p className="underline text-white hover:text-slate-500">
                {" "}
                Register a Startup{" "}
              </p>
            </a> */}
          </div>
        </div>
      </div>
      <div className="w-full max-w-screen-2xl mt-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
        {projects?.map((project) => (
          <ProjectTile project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
};

export default ProjectLayout;
