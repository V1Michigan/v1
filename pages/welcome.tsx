import { NextPage } from "next";
import { useRouter } from "next/router";
import useSupabase from "../hooks/useSupabase";
import { isGoogleUser } from "../contexts/SupabaseContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank } = useSupabase();
  const router = useRouter();
  if (!user) {
    return null;
  }

  const [initialName, initialAvatarUrl] = isGoogleUser(user)
    ? [user.user_metadata.full_name, user.user_metadata.avatar_url]
    : [undefined, undefined];

  if (rank === null) {
    return (
      <Step1
        email={ user.email }
        initialName={ initialName }
        initialAvatarUrl={ initialAvatarUrl }
        nextStep={ () => {
          setRank(0);
          router.push("/dashboard"); // instead of going to Step2
        } } />
    );
  }
  if (rank === 0) {
    // Not sure we should be use /welcome also for Step2
    return <Step2 nextStep={ () => setRank(1) } />;
  }
  // Else, rank >= 1
  return <Redirect route="/dashboard" />;
};

export default () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);
