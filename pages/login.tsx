import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import SignIn from "../components/SignIn";
import useSupabase from "../hooks/useSupabase";

const LoginPage: NextPage = () => {
  const { user } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user, router]);
  return <SignIn isLoginPage />;
};

export default LoginPage;
