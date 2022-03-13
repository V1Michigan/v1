import { NextPage } from "next";
import useSupabase from "../hooks/useSupabase";
import { isGoogleUser } from "../contexts/SupabaseContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";

const WelcomePage: NextPage = () => {
  const { user, rank, setRank } = useSupabase();
  if (!user) {
    return null;
  }

  const [initialName, initialAvatarUrl] = isGoogleUser(user)
    ? [user.user_metadata.full_name, user.user_metadata.avatar_url]
    : [undefined, undefined];

  if (!rank) { // May be null or 0
    return (
      <Step1
        email={ user.email }
        initialName={ initialName }
        initialAvatarUrl={ initialAvatarUrl }
        nextStep={ () => setRank(1) } />
    );
  }
  if (rank === 1) {
    return <Step2 nextStep={ () => setRank(2) } />;
  }

  // Else, rank >= 2
  return <Redirect route="/profile" />;
};

export default () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);
