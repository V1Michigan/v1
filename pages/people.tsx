/* eslint-disable react/jsx-no-bind */
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "../components/Head";
import useSupabase from "../hooks/useSupabase";
import NavbarBuilder from "../components/NavBar";

const People: NextPage = () => {
  const router = useRouter();
  const { supabase, user, rank } = useSupabase();

  return (
    <>
      <Head title="Startups" />
      <NavbarBuilder />
    </>
  );
};

export default People;
