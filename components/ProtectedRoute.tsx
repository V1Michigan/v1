import { useRouter } from "next/router";
import PropTypes from "prop-types";
import useSupabase from "../hooks/useSupabase";
import Redirect from "./Redirect";

interface ProtectedRouteProps {
  children: JSX.Element;
  minRank?: number;
}

export default function ProtectedRoute({ children, minRank }: ProtectedRouteProps) {
  const { user, rank } = useSupabase();
  const router = useRouter();
  if (user) {
    /* eslint-disable no-else-return */
    if (rank === null) {
      if (router.pathname !== "/welcome") {
        return <Redirect route="/welcome" />;
      }
    // Assert rank !== undefined because we have user + rank !== null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else if (minRank && rank! < minRank) {
      return <Redirect route="/dashboard" />;
    }
    return children;
  }
  // No user
  return <Redirect route="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
