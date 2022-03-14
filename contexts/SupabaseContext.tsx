import {
  createContext, useState, useEffect, ReactChild, ReactChildren,
} from "react";
import PropTypes from "prop-types";
import {
  SupabaseClient, Session, User, UserCredentials, Provider, ApiError, PostgrestSingleResponse,
} from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";

// Rank breakdown:
// 0: user exists, but hasn't completed sign-up Step 1 (this is the DB default)
// 1: completed Step 1, now has dashboard access + can schedule 1:1 calls
// 2, 3: in onboarding cohort
// 4: General member
// 5: Member++

// TODO: How do we decide when to prompt to fill in more profile data? (Step 2 and beyond)
// We could use Rank 2 for that, but we might want more data in the future
// Should we just query the DB and check if the fields are empty?

interface EmailUser extends User {
  email: string; // We know email isn't undefined
}

interface GoogleUser extends User {
  email: string;
  /* eslint-disable camelcase */
  user_metadata: {
    // Only defining the fields we need
    full_name: string;
    avatar_url: string;
  }
}

export const isGoogleUser = (user: User | EmailUser | GoogleUser): user is GoogleUser => user.app_metadata.provider === "google";

interface SupabaseContextInterface {
  supabase: SupabaseClient;
  signIn: (
    (credentials: UserCredentials, options: { redirectTo: string }) =>
    Promise<{
      session: Session | null
      user: User | null
      provider?: Provider
      url?: string | null
      error: ApiError | null
    }>
  );
  signOut: () => Promise<{ error: ApiError | null }>;
  // Would be nice if these weren't nullable under `ProtectedRoute`s
  // ...maybe a second UserContext that fetches all this data? :/
  user: EmailUser | GoogleUser | null;
  username: string | null;
  setUsername: (username: string) => void;
  rank: number | null;
  setRank: (rank: number) => void;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }: { children: ReactChild | ReactChildren }) {
  // Default value checks for an active session
  const [user, setUser] = useState<User | null>(supabase.auth.session()?.user ?? null);
  const [username, setUsername] = useState<string | null>(null);
  const [rank, setRank_] = useState<number | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.unsubscribe();
  }, []);

  useEffect(() => {
    async function getUserData() {
      if (user) {
        // TODO: Should be fixed with Supabase DB types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data, error, status } = await supabase
          .from("profiles")
          .select("username, rank")
          .eq("id", user.id)
          .single() as PostgrestSingleResponse<{username: string, rank: number}>;

        if (error && status !== 406) {
          throw error;
        }

        setUsername(data?.username ?? null);
        setRank_((data as {rank?: number})?.rank || 0);
      }
    }
    getUserData();
  }, [user]);

  // Update local state and Supabase DB
  const setRank = async (newRank: number) => {
    if (user) {
      setRank_(newRank);
      await supabase
        .from("profiles")
        .update({ rank: newRank }, { returning: "minimal" })
        .eq("id", user.id);
    }
  };

  let typedUser = null as GoogleUser | EmailUser | null;
  if (user) {
    if (isGoogleUser(user)) {
      typedUser = user;
    } else {
      typedUser = user as EmailUser;
    }
  }

  // If we have user, wait to load rank before rendering (this feels kinda sketchy)
  if (user && rank === null) {
    return null;
  }

  return (
    <SupabaseContext.Provider value={ {
      supabase,
      // Can't just say supabase.auth.signIn, gotta do bind()
      signIn: supabase.auth.signIn.bind(supabase.auth),
      signOut: supabase.auth.signOut.bind(supabase.auth),
      user: typedUser,
      username,
      setUsername,
      rank,
      setRank,
    } }>
      {children}
    </SupabaseContext.Provider>
  );
}

SupabaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SupabaseContext, SupabaseProvider };
