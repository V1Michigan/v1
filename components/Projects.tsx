import Fade from "./Fade";

const PROJECTS = [
  {
    name: "Startup Fair",
    description:
      "The largest student-run startup career fair at the University of Michigan",
    image: "/projects/startup-fair.jpg",
  },
];

interface ProjectProps {
  name: string;
  description: string;
  image: string;
}

const Project = ({ name, description, image }: ProjectProps) => (
  <Fade>
    <div
      className="text-white h-screen w-1/4 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="p-4 h-full flex flex-col justify-end bg-gradient-to-t from-black to-white opacity-50">
        <h3 className="text-5xl font-semibold">{name}</h3>
        <p className="text-2xl">{description}</p>
      </div>
    </div>
  </Fade>
);

const Projects = () =>
  PROJECTS.map((project) => <Project key={project.name} {...project} />);

export default Projects;
