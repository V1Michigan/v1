import { NextPage } from "next";
import ProtectedRoute from "../../components/ProtectedRoute";
import Redirect from "../../components/Redirect";
import useSupabase from "../../hooks/useSupabase";

// Redirects to the current user's profile
const ProfileIndex: NextPage = () => {
  const { username } = useSupabase();
  // username shouldn't be null since this is a ProtectedRoute, but might take a sec to load
  return username ? <Redirect route={ `/profile/${username}` } /> : null;
};

export default () => (
  <ProtectedRoute>
    <ProfileIndex />
  </ProtectedRoute>
);
