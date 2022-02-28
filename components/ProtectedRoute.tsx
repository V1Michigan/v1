import { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import useSupabase from "../hooks/useSupabase";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, onboardingStep } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      if (onboardingStep !== "COMPLETED" && router.pathname !== "/welcome") {
        router.push("/welcome");
      }
    } else {
      router.push("/login");
    }
  }, [user, onboardingStep, router]);
  return user ? children : null;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
