import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import ProtectedRoute from "../../components/ProtectedRoute";
import useSupabase from "../../hooks/useSupabase";

// Redirects to the current user's profile
const ProfileIndex: NextPage = () => {
  const router = useRouter();
  const { username } = useSupabase();
  useEffect(() => {
    // username shouldn't be null since this is a ProtectedRoute,
    // but might take a sec to load
    if (username) {
      router.replace(`/profile/${username}`);
    }
  }, [username, router]);
  return null;
};

export default () => (
  <ProtectedRoute>
    <ProfileIndex />
  </ProtectedRoute>
);
