// Could use an int enum for easier comparisons, but strings are nice for debugging
enum Rank {
  // undefined: no user
  RANK_NULL = "RANK_NULL", // user exists, but hasn't finished sign-up Step 1 (this is the DB default)
  RANK_0 = "RANK_0", // completed Step 1, prompted to schedule 1:1 coffee chat
  // Rank 1: signed up for coffee chat, now has entry in `onboarding` table, prompted to complete Step 2
  RANK_1_ONBOARDING_0 = "RANK_1_ONBOARDING_0", // hasn't finished sign-up Step 2
  RANK_1_ONBOARDING_1 = "RANK_1_ONBOARDING_1", // contacted for coffee chat, has not completed sign-up Step 2
  RANK_1_ONBOARDING_2 = "RANK_1_ONBOARDING_2", // completed sign-up Step 2 (can access /profile), not contacted for coffee chat
  RANK_1_ONBOARDING_3 = "RANK_1_ONBOARDING_3", // contacted for coffee chat and completed sign-up Step 2
  // Rank 2: completed coffee chat + finished sign-up Step 2
  RANK_2_ONBOARDING_0 = "RANK_2_ONBOARDING_0", // not registered for cohort
  RANK_2_ONBOARDING_1 = "RANK_2_ONBOARDING_1", // registered for, but not completed cohort
  RANK_3 = "RANK_3", // completed onboarding cohort, begin mini-project
  MEMBER = "MEMBER", // General Member: completed mini-project! 🎉
  BUILDER = "BUILDER",
  LEADERSHIP = "LEADERSHIP",
}

const numberToRank = (
  rank: number,
  onboardingStatus: number | null
): undefined | Rank => {
  switch (rank) {
    case null:
      return Rank.RANK_NULL;
    case 0:
      return Rank.RANK_0;
    case 1:
      switch (onboardingStatus) {
        case 1:
          return Rank.RANK_1_ONBOARDING_1;
        case 2:
          return Rank.RANK_1_ONBOARDING_2;
        case 3:
          return Rank.RANK_1_ONBOARDING_3;
        case 0:
        default:
          return Rank.RANK_1_ONBOARDING_0;
      }
    case 2:
      switch (onboardingStatus) {
        case 1:
          return Rank.RANK_2_ONBOARDING_1;
        case 0:
        default:
          return Rank.RANK_2_ONBOARDING_0;
      }
    case 3:
      return Rank.RANK_3;
    case 4:
      return Rank.MEMBER;
    case 5:
      return Rank.BUILDER;
    case 6:
      return Rank.LEADERSHIP;
    default:
      return undefined;
  }
};

const rankToNumber = (
  rank: Rank
): { rank: number | null | undefined; onboardingStatus?: number } => {
  switch (rank) {
    case Rank.RANK_NULL:
      return { rank: null };
    case Rank.RANK_0:
      return { rank: 0 };
    case Rank.RANK_1_ONBOARDING_0:
      return { rank: 1, onboardingStatus: 0 };
    case Rank.RANK_1_ONBOARDING_1:
      return { rank: 1, onboardingStatus: 1 };
    case Rank.RANK_1_ONBOARDING_2:
      return { rank: 1, onboardingStatus: 2 };
    case Rank.RANK_1_ONBOARDING_3:
      return { rank: 1, onboardingStatus: 3 };
    case Rank.RANK_2_ONBOARDING_0:
      return { rank: 2, onboardingStatus: 0 };
    case Rank.RANK_2_ONBOARDING_1:
      return { rank: 2, onboardingStatus: 1 };
    case Rank.RANK_3:
      return { rank: 3 };
    case Rank.MEMBER:
      return { rank: 4 };
    case Rank.BUILDER:
      return { rank: 5 };
    case Rank.LEADERSHIP:
      return { rank: 6 };
    default:
      return { rank: undefined };
  }
};

const RANK_COMPARISONS = {
  undefined: 0,
  [Rank.RANK_NULL]: 1,
  [Rank.RANK_0]: 2,
  [Rank.RANK_1_ONBOARDING_0]: 3,
  [Rank.RANK_1_ONBOARDING_1]: 4,
  [Rank.RANK_1_ONBOARDING_2]: 5,
  [Rank.RANK_1_ONBOARDING_3]: 6,
  [Rank.RANK_2_ONBOARDING_0]: 7,
  [Rank.RANK_2_ONBOARDING_1]: 8,
  [Rank.RANK_3]: 9,
  [Rank.MEMBER]: 10,
  [Rank.BUILDER]: 11,
  [Rank.LEADERSHIP]: 12,
};
const rankLessThan = (rank1: Rank, rank2: Rank): boolean =>
  RANK_COMPARISONS[rank1] < RANK_COMPARISONS[rank2];

export { Rank, numberToRank, rankToNumber, rankLessThan };
