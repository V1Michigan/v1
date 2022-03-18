import useSupabase from "../../hooks/useSupabase";
import NextStepCard from "./NextStepCard";
import { Rank, rankLessThan } from "../../constants/rank";

const CoffeeChatRegister = () => {
  const { rank, setRank } = useSupabase();
  // Only show if rank < 2 (undefined check is a type guard)
  if (rank === undefined || rankLessThan(Rank.RANK_1_ONBOARDING_1, rank)) {
    return null;
  }
  const submitted = rankLessThan(Rank.RANK_0, rank);
  return (
    <NextStepCard
      title="Schedule a coffee chat with V1 Leadership ☕️"
      description={
        submitted ? (
          "Great! ✅ We'll reach out to you via email soon."
        ) : (
          <>
            <p className="mb-2">
              V1 provides the most driven students with an extraordinary
              network, exclusive opportunities within startups, and mentorship
              to grow and achieve great things, together.
            </p>
            <p className="font-bold">
              Start the process to become an official V1 member today.
            </p>
          </>
        )
      }
      buttonText={submitted ? undefined : "I'm interested"}
      disabled={submitted}
      onClick={() => setRank(Rank.RANK_1_ONBOARDING_0)}
    />
  );
};

export default CoffeeChatRegister;
