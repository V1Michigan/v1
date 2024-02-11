import { NextPage } from "next";
import Head from "../components/Head";
import NavbarBuilder from "../components/NavBar";
import ProjectLayout from "../components/ProjectLayout";

const Projects: NextPage = () => (
  <>
    <Head title="Projects" />
    <NavbarBuilder />
    <ProjectLayout
      title="Projects"
      description="Under construction! Check back soon."
      link="https://www.google.com"
    />
  </>
);

export default Projects;
