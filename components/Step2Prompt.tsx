import useSupabase from "../hooks/useSupabase";
import NextStepCard from "./NextStepCard";

const Step2Prompt = () => {
  const { rank } = useSupabase();
  if (rank !== 0) {
    // If rank > 0, should we show this, but "checked off"?
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
