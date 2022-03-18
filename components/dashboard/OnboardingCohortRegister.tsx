import useSupabase from "../../hooks/useSupabase";
import NextStepCard from "./NextStepCard";
import { Rank, rankLessThan } from "../../constants/rank";

const OnboardingCohortRegister = () => {
  const { rank, setRank } = useSupabase();
  // Only show if 2 <= rank < 3 (undefined check is a type guard)
  if (
    rank === undefined ||
    !(
      rankLessThan(Rank.RANK_1_ONBOARDING_1, rank) &&
      rankLessThan(rank, Rank.RANK_3)
    )
  ) {
    return null;
  }
  const submitted = rankLessThan(Rank.RANK_2_ONBOARDING_0, rank);
  return (
    <NextStepCard
      title="Join a V1 Onboarding Cohort"
      description={
        submitted
          ? "Great! ✅ We'll reach out to you via email soon — welcome to the V1 family."
          : `
            Take the next step in your V1 journey by joining an onboarding
            cohort. Meet, build, and bond with members of the V1 community
            in a tight-knit environment.
          `
      }
      buttonText={submitted ? undefined : "Sign me up! 🚀"}
      disabled={submitted}
      onClick={() => setRank(Rank.RANK_2_ONBOARDING_1)}
    />
  );
};

export default OnboardingCohortRegister;
