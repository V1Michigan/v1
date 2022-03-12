import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import Login from "../components/Login";
import useSupabase from "../hooks/useSupabase";

const LoginPage: NextPage = () => {
  const { user } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user, router]);
  return <Login />;
};

export default LoginPage;
