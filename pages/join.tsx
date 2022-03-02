import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import SignUp from "../components/SignUp";
import useSupabase from "../hooks/useSupabase";

const JoinPage: NextPage = () => {
  const { user } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user, router]);
  return <SignUp />;
};

export default JoinPage;
