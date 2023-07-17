import { NextPage } from "next";
import ReactGA from "react-ga4";
import useSupabase from "../hooks/useSupabase";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/profile/onboarding/Step1";
import Rank from "../constants/rank";
import Step2 from "../components/profile/onboarding/Step2";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank, profileComplete } = useSupabase();

  // Type guard: this case should never occur, so report error
  if (!user || rank === null || profileComplete === null) {
    // TODO: need to double check `category` with GA provider
    ReactGA.event({
      category: "Profile",
      action: "Error on welcome page: user, rank, or profileComplete is null",
    });
    return (
      <Redirect route="/error?msg=user, rank or profileComplete is null" />
    );
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
