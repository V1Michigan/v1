import { useRouter } from "next/router";
import { useEffect } from "react";
import Login from "../components/Login";
import useSupabase from "../hooks/useSupabase";

export default function LoginPage() {
  const { user } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);
  return <Login />;
}
