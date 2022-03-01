import { useRouter } from "next/router";
import useSupabase from "../../hooks/useSupabase";

const OnboardingComplete = () => {
  const { user } = useSupabase();
  const router = useRouter();
  if (!user) {
    return null;
  }

  return (
    <div>
      <p>
        Onboarding complete!
        {" "}
        <b>Welcome to V1!</b>
      </p>
      <button type="button" onClick={ () => router.push("/account") }>
        Let&apos;s get started!
      </button>
    </div>
  );
};

export default OnboardingComplete;
