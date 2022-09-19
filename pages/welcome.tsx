import { NextPage } from "next";
import useSupabase from "../hooks/useSupabase";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/profile/onboarding/Step1";
import Rank from "../constants/rank";
import Step2 from "../components/profile/onboarding/Step2";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank, profileComplete } = useSupabase();

  // Type guard
  if (!user || rank === null || profileComplete === null) {
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

  if (!profileComplete) {
    return <Step2 />;
  }

  return <Redirect route="/dashboard" />;
};

const ProtectedWelcome = () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);

export default ProtectedWelcome;
