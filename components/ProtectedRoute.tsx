import { useRouter } from "next/router";
import PropTypes from "prop-types";
import useSupabase from "../hooks/useSupabase";
import Redirect from "./Redirect";

interface ProtectedRouteProps {
  children: JSX.Element;
  minRank?: number;
}

export default function ProtectedRoute({ children, minRank = 1 }: ProtectedRouteProps) {
  const { user, rank } = useSupabase();
  const router = useRouter();
  if (user) {
    if ((rank === null || rank === 0) && router.pathname !== "/welcome") {
      return <Redirect route="/welcome" />;
    }
    if (rank && minRank && rank < minRank) {
      return <Redirect route="/dashboard" />;
    }
    return children;
  }
  return <Redirect route="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
