import { useRouter } from "next/router";
import PropTypes from "prop-types";
import useSupabase from "../hooks/useSupabase";
import Redirect from "./Redirect";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, rank } = useSupabase();
  const router = useRouter();
  if (user) {
    // Rank may be null or 0
    if (!rank && router.pathname !== "/welcome") {
      return <Redirect route="/welcome" />;
    }
    return children;
  }
  return <Redirect route="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
