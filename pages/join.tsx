import { NextPage } from "next";
import SignUp from "../components/SignUp";
import Redirect from "../components/Redirect";
import useSupabase from "../hooks/useSupabase";

const JoinPage: NextPage = () => {
  const { user } = useSupabase();
  return user ? <Redirect route="/dashboard" /> : <SignUp />;
};

export default JoinPage;
