import { NextPage } from "next";
import useSupabase from "../hooks/useSupabase";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/profile/onboarding/Step1";
import Rank from "../constants/rank";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank } = useSupabase();

  // Type guard
  if (!user || rank === null) {
    return null;
  }

  if (rank === Rank.NEW_USER) {
    return (
      <Step1
        email={user.email}
        initialName={user.user_metadata.full_name}
        initialAvatarUrl={user.user_metadata.avatar_url}
        nextStep={() => setRank(Rank.INACTIVE_MEMBER)}
      />
    );
  }
  // Else, rank === RANK_0 (not prompted to fill Step2)
  // or they've already filled it (rank >= Rank.RANK_1_ONBOARDING_2)
  return <Redirect route="/dashboard" />;
};

const ProtectedWelcome = () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);

export default ProtectedWelcome;
