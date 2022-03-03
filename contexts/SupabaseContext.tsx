import {
  createContext, useState, useEffect, ReactChild, ReactChildren,
} from "react";
import PropTypes from "prop-types";
import {
  SupabaseClient, Session, User, UserCredentials, Provider, ApiError,
} from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";

type OnboardingStep =
  | "REGISTERED"
  | "SCREEN_1"
  | "SCREEN_2"
  | "COMPLETE"

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
  signUp: ({ email, password }: UserCredentials, options: { redirectTo: string }) => Promise<{
    user: User | null
    session: Session | null
    error: ApiError | null
  }>;
  signOut: () => Promise<{ error: ApiError | null }>;
  // TODO: Would be nice if these weren't nullable under `ProtectedRoute`s
  user: EmailUser | GoogleUser | null;
  onboardingStep: OnboardingStep | null;
  setOnboardingStep: (step: OnboardingStep) => void;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }: { children: ReactChild | ReactChildren }) {
  // Default value checks for an active session
  const [user, setUser] = useState<User | null>(supabase.auth.session()?.user ?? null);
  const [onboardingStep, setOnboardingStep_] = useState<OnboardingStep | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.unsubscribe();
  }, []);

  useEffect(() => {
    async function getOnboardingStep() {
      if (user) {
        const { data, error, status } = await supabase
          .from("profiles")
          .select("onboarding_step")
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        setOnboardingStep_(data?.onboarding_step || "REGISTERED");
      }
    }
    getOnboardingStep();
  }, [user]);

  // Update local state and Supabase DB
  const setOnboardingStep = async (step: OnboardingStep) => {
    if (user) {
      setOnboardingStep_(step);
      await supabase
        .from("profiles")
        .update({ onboarding_step: step }, { returning: "minimal" })
        .eq("id", user.id);
    }
  };

  let typedUser = null;
  if (user) {
    if (user.app_metadata.provider === "google") {
      typedUser = user as GoogleUser;
    } else {
      typedUser = user as EmailUser;
    }
  }

  // If we have user, wait to load onboardingStep before rendering
  // TODO: This feels kinda sketchy
  if (user && !onboardingStep) {
    return null;
  }

  return (
    <SupabaseContext.Provider value={ {
      supabase,
      // Can't just say supabase.auth.signIn, gotta do bind()
      signIn: supabase.auth.signIn.bind(supabase.auth),
      signUp: supabase.auth.signUp.bind(supabase.auth),
      signOut: supabase.auth.signOut.bind(supabase.auth),
      user: typedUser,
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
