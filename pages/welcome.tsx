import { useEffect } from "react";
import { NextPage } from "next";
import useSupabase from "../hooks/useSupabase";
import ProtectedRoute from "../components/ProtectedRoute";
import Step1 from "../components/onboarding/Step1";
import Step2 from "../components/onboarding/Step2";
import OnboardingComplete from "../components/onboarding/Complete";

const WelcomePage: NextPage = () => {
  const { user, onboardingStep, setOnboardingStep } = useSupabase();

  useEffect(() => {
    if (onboardingStep === "REGISTERED") {
      setOnboardingStep("SCREEN_1");
    }
  }, [onboardingStep, setOnboardingStep]);
  if (!user || onboardingStep === "REGISTERED") {
    return null;
  }

  const [initialName, initialAvatarUrl] = (user.app_metadata.provider === "google")
    ? [user.user_metadata.full_name, user.user_metadata.avatar_url]
    : [undefined, undefined];

  if (onboardingStep === "SCREEN_1") {
    return (
      <Step1
        email={ user.email }
        initialName={ initialName }
        initialAvatarUrl={ initialAvatarUrl }
        nextStep={ () => setOnboardingStep("SCREEN_2") } />
    );
  }
  if (onboardingStep === "SCREEN_2") {
    return <Step2 nextStep={ () => setOnboardingStep("COMPLETE") } />;
  }
  // Else, onboardingStep === "COMPLETE"
  return <OnboardingComplete />;
};

export default () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);
