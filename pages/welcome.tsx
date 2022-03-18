import { NextPage } from "next";
import useSupabase from "../hooks/useSupabase";
import { isGoogleUser } from "../contexts/SupabaseContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/profile/onboarding/Step1";
import Step2 from "../components/profile/onboarding/Step2";
import { Rank } from "../constants/rank";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank } = useSupabase();

  // Type guard
  if (!user || rank === undefined) {
    return null;
  }

  const [initialName, initialAvatarUrl] = isGoogleUser(user)
    ? [user.user_metadata.full_name, user.user_metadata.avatar_url]
    : [undefined, undefined];

  if (rank === Rank.RANK_NULL) {
    return (
      <Step1
        email={user.email}
        initialName={initialName}
        initialAvatarUrl={initialAvatarUrl}
        nextStep={() => setRank(Rank.RANK_0)}
      />
    );
  }
  if (rank === Rank.RANK_1_ONBOARDING_0) {
    // Not sure we should be using /welcome also for Step2
    return <Step2 nextStep={() => setRank(Rank.RANK_1_ONBOARDING_1)} />;
  }
  // Else, rank === RANK_0 (not prompted to fill Step2)
  // or they've already filled it (rank >= Rank.RANK_1_ONBOARDING_1)
  return <Redirect route="/dashboard" />;
};

const ProtectedWelcome = () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);

export default ProtectedWelcome;
