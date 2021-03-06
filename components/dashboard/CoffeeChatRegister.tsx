import ReactGA from "react-ga4";
import useSupabase from "../../hooks/useSupabase";
import NextStepCard from "./NextStepCard";
import { Rank, rankLessThan } from "../../constants/rank";

const CoffeeChatRegister = () => {
  const { rank, setRank } = useSupabase();
  // Only show if rank < 2 (undefined check is a type guard)
  if (rank === undefined || !rankLessThan(rank, Rank.RANK_2_ONBOARDING_0)) {
    return null;
  }

  const submitted = rankLessThan(Rank.RANK_0, rank);
  const handleSubmit = () => {
    ReactGA.event({
      category: "Onboarding",
      action: "Registered for coffee chat",
    });
    setRank(Rank.RANK_1_ONBOARDING_0);
  };

  let description = null;
  if (submitted) {
    if (
      rank === Rank.RANK_1_ONBOARDING_1 ||
      rank === Rank.RANK_1_ONBOARDING_3
    ) {
      description =
        "Check your email for an invitation to schedule your coffee chat 🙂";
    } else {
      description = "Great! ✅ We'll reach out to you via email soon.";
    }
  } else {
    description = (
      <>
        <p className="mb-2">
          V1 provides the most driven students with an extraordinary network,
          exclusive opportunities within startups, and mentorship to grow and
          achieve great things, together.
        </p>
        <p className="font-bold">
          Start the process to become a V1 member today.
        </p>
      </>
    );
  }

  return (
    <NextStepCard
      title="Schedule a coffee chat with a V1 member ☕️"
      description={description}
      buttonText={submitted ? undefined : "I'm interested"}
      disabled={submitted}
      onClick={handleSubmit}
    />
  );
};

export default CoffeeChatRegister;
