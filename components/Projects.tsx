import { Fragment } from "react";
import Fade from "./Fade";

const PROJECTS = [
  {
    name: "Startup Fair",
    description:
      "The largest student-run startup career fair at the University of Michigan",
    // If we ever get # of hire metrics...that'd be awesome here
    stats: ["400+ students", "239 1:1 matches", "17 high-growth startups"],
    // Would be cool to have some company logos here
    image: "/projects/startup-fair.jpg",
  },
  {
    name: "V1 Connect",
    description:
      "Bringing together top Michigan builders to connect and collaborate",
    stats: ["80+ students", "Dozens of projects", "∞ connections"],
    image: "/projects/connect.jpg",
  },
];

interface ProjectProps {
  name: string;
  description: string;
  stats: string[];
  image: string;
}

const Project = ({ name, description, stats, image }: ProjectProps) => (
  <Fade motion={false}>
    <div
      className="text-white h-screen-3/4 w-5/6 mx-auto my-8 bg-cover bg-fixed bg-no-repeat shadow-2xl"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="h-full bg-gradient-to-t from-black/75 to-white/50 flex flex-col justify-end gap-y-1 p-4">
        <h3 className="text-5xl font-semibold">{name}</h3>
        <p className="text-2xl">{description}</p>
        <div className="flex flex-row justify-start items-center gap-x-2">
          {stats.map((stat, i) => (
            <Fragment key={stat}>
              <p className="text-md font-bold tracking-tighter">{stat}</p>
              {i < stats.length - 1 && <span>&bull;</span>}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  </Fade>
);

const Projects = () => (
  <>
    {PROJECTS.map((project) => (
      <Project
        key={project.name}
        name={project.name}
        description={project.description}
        stats={project.stats}
        image={project.image}
      />
    ))}
  </>
);

export default Projects;
