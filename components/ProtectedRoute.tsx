import { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import useSupabase from "../hooks/useSupabase";

export default function ProtectedRoute({ children }) {
  const { user } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  return user ? children : null;
}

ProtectedRoute.propTypes = {
  component: PropTypes.node.isRequired,
};
