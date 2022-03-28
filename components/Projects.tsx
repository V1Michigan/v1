import { Fragment } from "react";
import Fade from "./Fade";

const PROJECTS = [
  {
    name: "Startup Fair",
    link: "https://startupfair.v1michigan.com",
    description:
      "The largest student-run startup career fair at the University of Michigan",
    // If we ever get # of hire metrics...that'd be awesome here
    stats: ["400+ students", "239 1:1 matches", "17 high-growth startups"],
    // Would be cool to have some company logos here
    image: "/projects/startup-fair.jpg",
  },
  {
    // Maybe remove "V1" from "V1 Platform"
    name: "V1 Platform",
    link: "/join",
    description: "The operating system for our community.",
    // We could just call this "V1 Community" and use newsletter/Discord stats
    stats: [], // TODO: ???
    image: "/projects/platform.png",
  },
  {
    name: "V1 Connect",
    // TODO: More recent newsletter link or RSVP
    link: "https://v1network.substack.com/p/whats-next-v1-connect-meet-michigans",
    description:
      "Bringing together the top student builders to connect and collaborate.",
    stats: ["80+ students", "Dozens of projects", "∞ connections"],
    // TODO: Downsample images
    image: "/projects/connect.jpg",
  },
];

interface ProjectProps {
  name: string;
  link: string;
  description: string;
  stats: string[];
  image: string;
}

const Project = ({ name, link, description, stats, image }: ProjectProps) => (
  <Fade motion={false}>
    <div
      // Consider applying scale transform via parallax instead of hover
      className="text-white h-screen-3/4 w-5/6 mx-auto my-8 bg-cover bg-fixed bg-no-repeat shadow-lg transition hover:scale-105 hover:shadow-2xl"
      style={{ backgroundImage: `url(${image})` }}
    >
      <a href={link} target="_blank">
        <div className="h-full bg-gradient-to-t from-black/75 to-white/50 flex flex-col justify-end gap-y-1 p-4">
          <h3 className="text-4xl font-bold">{name}</h3>
          <p className="text-2xl">{description}</p>
          <div className="flex flex-row justify-start items-center gap-x-2">
            {stats.map((stat, i) => (
              <Fragment key={stat}>
                <p className="text-lg font-bold tracking-tighter">{stat}</p>
                {i < stats.length - 1 && <span>&bull;</span>}
              </Fragment>
            ))}
          </div>
        </div>
      </a>
    </div>
  </Fade>
);

const Projects = () => (
  <>
    {PROJECTS.map((project) => (
      <Project
        key={project.name}
        name={project.name}
        link={project.link}
        description={project.description}
        stats={project.stats}
        image={project.image}
      />
    ))}
  </>
);

export default Projects;
