import { Fragment } from "react";
import Fade from "./Fade";

const PROJECTS = [
  {
    name: "Product Studio",
    link: "/projects",
    description: "Helping students build and pursue their dreams. Come in with an idea, launch in 8 weeks.",
    stats: [
      "0 to 1 in one semester",
      "1:1 mentorship",
      "Our pre-idea incubator",
    ],
    image: "/projects/studio.jpg",
  },
  {
    name: "Startup Fair",
    link: "https://startupfair.v1michigan.com",
    description: "Connecting high-growth startups with top student talent for impactful engineering roles.",
    // If we ever get # of hire metrics...that'd be awesome here
    // TODO: Hopin metrics
    stats: ["200+ students", "30+ offers extended", "17 high-growth startups"],
    // Would be cool to have some company logos here
    image: "/projects/startup-fair.jpg",
  },
  {
    name: "Ship-It",
    link: "/ship-it",
    description: "Co-working sessions for motivated individuals to make progress on their own ideas",
    stats: ["Hosted weekly", "2 hours of deep work", "Open to all students"],
    image: "/projects/ship-it.png",
  },
  // {
  //   // Maybe remove "V1" from "V1 Platform"
  //   name: "V1 Platform",
  //   link: "/join",
  //   description: "The operating system for our community",
  //   // We could just call this "V1 Community" and use newsletter/Discord stats
  //   stats: [], // TODO: ???
  //   image: "/projects/platform.png",
  // },
  {
    name: "Connect",
    // TODO: More recent newsletter link or RSVP
    link: "https://v1network.substack.com/",
    description:
      "Hosting startup industry leaders to share their stories. Meet founders, investors, and more.",
    stats: [
      "Fireside chats",
      "Office hours",
      "Dinners",
      "Open to all students",
    ],
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
      className="text-white h-screen-3/4 m-4 bg-center bg-cover bg-no-repeat shadow-lg transition hover:shadow-2xl rounded-2xl overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      <a href={link} target="_blank" rel="noreferrer">
        <div className="h-full bg-gradient-to-t from-black/75 to-white/50 flex flex-col justify-end gap-y-1 p-4">
          <h3 className="text-4xl font-bold">{name}</h3>
          <p className="text-2xl">{description}</p>
          <div className="flex flex-row flex-wrap md:flex-nowrap justify-start items-center gap-x-2">
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
  <div className="grid lg:grid-cols-2">
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
  </div>
);

export default Projects;
