import { NextPage } from "next";
import Login from "../components/Login";
import Redirect from "../components/Redirect";
import useSupabase from "../hooks/useSupabase";

const LoginPage: NextPage = () => {
  const { user } = useSupabase();
  return user ? <Redirect route="/profile" /> : <Login />;
};

export default LoginPage;
