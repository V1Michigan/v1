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
import Rank from "../constants/rank";

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
  rank: Rank | null;
  setRank: (rank: Rank) => void;
  profileComplete: boolean | null;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

const RANK_UPDATE_URL = "https://v1-api-production.up.railway.app/rank";

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

  const [rank, setRank_] = useState<Rank | null>(null);
  const setRank = async (newRank: Rank) => {
    // Update local state and Supabase DB
    if (user && rank !== newRank) {
      setRank_(newRank);

      const updateRank = async () => {
        if (newRank === rank) {
          return;
        }
        const session = supabase.auth.session();
        if (!session) {
          return;
        }
        const { access_token: accessToken } = session;
        try {
          await fetch(RANK_UPDATE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ rank: newRank }),
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      };

      await updateRank();
    }
  };

  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    async function getUserData() {
      if (user) {
        setLoading(true);
        const { data, error, status } = (await supabase
          .from("profiles")
          .select(
            `
            username,
            bio,
            ranks (
              rank
            ),
            onboarding (
              status
            )
          `
          )
          .eq("id", user.id)
          .eq("ranks.user_id", user.id)
          .single()) as PostgrestSingleResponse<{
          username: string;
          ranks: { rank: number }[];
          bio: string | null;
        }>;

        if (error && status !== 406) {
          throw error;
        } else if (!data) {
          throw new Error("No user data found");
        }

        const { username: username_, ranks, bio } = data;
        const fetchedRank = ranks.length > 0 ? ranks[0].rank : null;

        setProfileComplete(bio !== null);

        setUsername(username_ ?? null);
        // setRank_, not setRank, don't need to update the DB
        setRank_(fetchedRank);
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
        profileComplete,
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
