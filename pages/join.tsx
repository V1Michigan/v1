import { NextPage } from "next";
import Header from "next/Head";
import Redirect from "../components/Redirect";
import SignIn from "../components/SignIn";
import useSupabase from "../hooks/useSupabase";

const JoinPage: NextPage = () => {
  const { user } = useSupabase();
  return user ? <Redirect route="/dashboard" /> : <SignIn isLoginPage={ false } />;
};

export default JoinPage;
