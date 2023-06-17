import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "../components/Head";
import useSupabase from "../hooks/useSupabase";
import NavbarBuilder from "../components/NavBar";
import DirectoryLayout from "../components/DirectoryLayout"

const Startups: NextPage = () => {
  const router = useRouter();
  const { supabase, user, rank } = useSupabase();

  return (
    <>
      <Head title="Startups" />
      <NavbarBuilder />
      <DirectoryLayout
        title="Startup Directory"
        description="Lorem ipsum."
        link="https://www.google.com"
      />
    </>
  );
};

export default Startups;
