import {
  createContext, useState, useEffect, ReactChild, ReactChildren,
} from "react";
import PropTypes from "prop-types";
import {
  SupabaseClient, Session, User, UserCredentials, Provider, ApiError, PostgrestSingleResponse,
} from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";

enum OnboardingStep {
  REGISTERED = "REGISTERED",
  SCREEN_1 = "SCREEN_1",
  SCREEN_2 = "SCREEN_2",
  COMPLETE = "COMPLETE",
}

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
  onboardingStep: OnboardingStep | null;
  setOnboardingStep: (step: OnboardingStep | string) => void;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }: { children: ReactChild | ReactChildren }) {
  // Default value checks for an active session
  const [user, setUser] = useState<User | null>(supabase.auth.session()?.user ?? null);
  const [username, setUsername] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep_] = useState<OnboardingStep | null>(null);

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
          .select("username, onboarding_step")
          .eq("id", user.id)
          .single() as PostgrestSingleResponse<{username: string, onboarding_step: OnboardingStep}>;

        if (error && status !== 406) {
          throw error;
        }

        setUsername(data?.username ?? null);
        setOnboardingStep_(
          (data as {onboarding_step?: OnboardingStep})?.onboarding_step
          || "REGISTERED" as OnboardingStep,
        );
      }
    }
    getUserData();
  }, [user]);

  // Update local state and Supabase DB
  const setOnboardingStep = async (step: OnboardingStep | string) => {
    if (user) {
      setOnboardingStep_(step as OnboardingStep);
      await supabase
        .from("profiles")
        .update({ onboarding_step: step }, { returning: "minimal" })
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

  // If we have user, wait to load onboardingStep before rendering (this feels kinda sketchy)
  if (user && !onboardingStep) {
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
      onboardingStep,
      setOnboardingStep,
    } }>
      {children}
    </SupabaseContext.Provider>
  );
}

SupabaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SupabaseContext, SupabaseProvider };
