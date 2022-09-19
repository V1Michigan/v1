import { useRouter } from "next/router";
import PropTypes from "prop-types";
import useSupabase from "../hooks/useSupabase";
import Redirect from "./Redirect";
import Rank from "../constants/rank";

interface ProtectedRouteProps {
  children: JSX.Element;
  minRank?: Rank | null;
}

export default function ProtectedRoute({
  children,
  minRank,
}: ProtectedRouteProps) {
  const { user, rank } = useSupabase();
  const router = useRouter();
  if (user) {
    // null check is mostly a type guard; if `user`, then `rank` !== null
    if (rank === null || rank === Rank.NEW_USER) {
      // pathname check prevents infinite redirect loop
      if (router.pathname !== "/welcome") {
        return <Redirect route="/welcome" />;
      }
    } else if (minRank && rank < minRank) {
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
