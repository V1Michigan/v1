import { NextPage } from "next";
import Head from "../components/Head";
import NavbarBuilder from "../components/NavBar";
import DirectoryLayout from "../components/DirectoryLayout";

const Startups: NextPage = () => (
  <>
    <Head title="Startups" />
    <NavbarBuilder />
    <DirectoryLayout
      title="Startup Directory"
      description="Under construction! Check back soon."
      link="https://www.google.com"
    />
  </>
);

export default Startups;
