import useSupabase from "../../hooks/useSupabase";
import NextStepCard from "./NextStepCard";
import { Rank } from "../../constants/rank";

const Step2Prompt = () => {
  const { rank } = useSupabase();
  if (rank !== Rank.RANK_1_ONBOARDING_0) {
    return null;
  }
  return (
    <NextStepCard
      title="Finish filling out your profile"
      description="Tell us more about you and what you're excited about"
      href="/welcome"
      buttonText="Let's go &rsaquo;"
    />
  );
};

export default Step2Prompt;
