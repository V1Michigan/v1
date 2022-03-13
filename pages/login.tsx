import { NextPage } from "next";
import Redirect from "../components/Redirect";
import SignIn from "../components/SignIn";
import useSupabase from "../hooks/useSupabase";

const LoginPage: NextPage = () => {
  const { user } = useSupabase();
  return user ? <Redirect route="/dashboard" /> : <SignIn isLoginPage />;
};

export default LoginPage;
