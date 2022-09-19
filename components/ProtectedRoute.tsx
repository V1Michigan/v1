import { useRouter } from "next/router";
import useSupabase from "../hooks/useSupabase";
import Redirect from "./Redirect";
import Rank from "../constants/rank";

interface ProtectedRouteProps {
  children: JSX.Element;
  minRank?: Rank;
}

export default function ProtectedRoute({
  children,
  minRank,
}: ProtectedRouteProps) {
  const { user, rank } = useSupabase();
  const router = useRouter();
  if (user) {
    // null check is just a type guard; if `user`, then `rank` !== null
    if (rank === null || rank === Rank.NEW_USER) {
      // pathname check prevents infinite redirect loop
      if (router.pathname !== "/welcome") {
        return <Redirect route="/welcome" />;
      }
    } else if (minRank !== undefined && rank < minRank) {
      return <Redirect route="/dashboard" />;
    }
    return children;
  }
  // No user
  return <Redirect route="/login" />;
}
