import {
  createContext,
  useState,
  useEffect,
  ReactChild,
  ReactChildren,
} from "react";
import PropTypes from "prop-types";
import {
  SupabaseClient,
  Session,
  User as SupabaseUser,
  UserCredentials,
  Provider,
  ApiError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";
import {
  Rank,
  numberToRank,
  rankToNumber,
  rankLessThan,
} from "../constants/rank";

// We only allow sign-in via Google OAuth, so
// user.app_metadata.provider === "google" is always true
interface User extends SupabaseUser {
  email: string;
  /* eslint-disable camelcase */
  user_metadata: {
    // Only defining the fields we need
    full_name: string;
    avatar_url: string;
  };
}

interface SupabaseContextInterface {
  supabase: SupabaseClient;
  signIn: (
    credentials: UserCredentials,
    options: { redirectTo: string }
  ) => Promise<{
    session: Session | null;
    user: SupabaseUser | null;
    provider?: Provider;
    url?: string | null;
    error: ApiError | null;
  }>;
  signOut: () => Promise<{ error: ApiError | null }>;
  // Would be nice if these weren't nullable under `ProtectedRoute`s
  // ...maybe a second UserContext that fetches all this data? :/
  user: User | null;
  username: string | null;
  setUsername: (username: string) => void;
  rank: Rank | undefined;
  setRank: (rank: Rank) => void;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({
  children,
}: {
  children: ReactChild | ReactChildren;
}) {
  // Default value checks for an active session
  const [user, setUser] = useState<User | null>(
    (supabase.auth.session()?.user as User) ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser((session?.user as User) ?? null);
        setLoading(true);
      }
    );
    return () => listener?.unsubscribe();
  }, []);

  const [username, setUsername] = useState<string | null>(null);

  const [rank, setRank_] = useState<Rank | undefined>(undefined);
  const setRank = async (newRank: Rank) => {
    // Update local state and Supabase DB
    if (user && rank !== newRank) {
      setRank_(newRank);
      const { rank: rankNumber, onboardingStatus } = rankToNumber(newRank);
      await Promise.all([
        supabase
          .from("profiles")
          .update({ rank: rankNumber }, { returning: "minimal" })
          .eq("id", user.id),
        // First time user has an onboarding status
        newRank === Rank.RANK_1_ONBOARDING_0 &&
          supabase.from("onboarding").upsert(
            {
              user_id: user.id,
              status: onboardingStatus,
              created_at: new Date(),
            },
            { returning: "minimal" }
          ),
        // Update an existing onboarding status
        rankLessThan(Rank.RANK_1_ONBOARDING_0, newRank) &&
          supabase
            .from("onboarding")
            .update(
              { status: onboardingStatus ?? null },
              { returning: "minimal" }
            )
            .eq("user_id", user.id),
      ]);
    }
  };

  useEffect(() => {
    async function getUserData() {
      if (user) {
        setLoading(true);
        const { data, error, status } = (await supabase
          .from("profiles")
          .select(
            `
            username,
            rank,
            onboarding (
              status
            )
          `
          )
          .eq("id", user.id)
          .eq("onboarding.user_id", user.id)
          .single()) as PostgrestSingleResponse<{
          username: string;
          rank: number;
          onboarding: { status: number }[];
        }>;

        if (error && status !== 406) {
          throw error;
        } else if (!data) {
          throw new Error("No user data found");
        }

        const { username: username_, rank: rank_, onboarding } = data;
        const onboardStatus =
          onboarding.length > 0 ? onboarding[0].status : null;

        setUsername(username_ ?? null);
        setRank_(numberToRank(rank_ ?? null, onboardStatus));
      }
      setLoading(false);
    }
    getUserData();
  }, [user]);

  // Don't want to render children if still loading (rank may be undefined)
  if (user && loading) {
    return null;
  }

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        // Can't just say supabase.auth.signIn, gotta do bind()
        signIn: supabase.auth.signIn.bind(supabase.auth),
        signOut: supabase.auth.signOut.bind(supabase.auth),
        user,
        username,
        setUsername,
        rank,
        setRank,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

SupabaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SupabaseContext, SupabaseProvider };
