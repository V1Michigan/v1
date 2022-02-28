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
  | "COMPLETED"

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
  user: User | null;
  onboardingStep: OnboardingStep | null;
  setOnboardingStep: (step: OnboardingStep) => void;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }: { children: ReactChild | ReactChildren }) {
  // Default value checks for an active session
  const [user, setUser] = useState<User | null>(supabase.auth.session()?.user ?? null);
  const [onboardingStep, setOnboardingStep_] = useState<OnboardingStep | null>(null);
  const loading = !user || (user && !onboardingStep);

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

        const { onboarding_step: onboardingStep_ = "REGISTERED" } = data;
        setOnboardingStep_(onboardingStep_);
      }
    }
    getOnboardingStep();
  }, [user]);

  // Update local state and Supabase DB
  const setOnboardingStep = (step: OnboardingStep) => {
    if (user) {
      setOnboardingStep_(step);
      supabase
        .from("profiles")
        .update({ id: user.id, onboarding_step: step }, { returning: "minimal" });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <SupabaseContext.Provider value={ {
      supabase,
      // Can't just say supabase.auth.signIn, gotta do bind()
      signIn: supabase.auth.signIn.bind(supabase.auth),
      signUp: supabase.auth.signUp.bind(supabase.auth),
      signOut: supabase.auth.signOut.bind(supabase.auth),
      user,
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
