import {
  createContext, useState, useEffect, ReactChild, ReactChildren,
} from "react";
import PropTypes from "prop-types";
import {
  SupabaseClient, Session, User, UserCredentials, Provider, ApiError,
} from "@supabase/supabase-js";
import supabase from "../utils/supabaseClient";

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
  signUp: ({ email, password, phone }: UserCredentials) => Promise<{
    user: User | null
    session: Session | null
    error: ApiError | null
  }>;
  signOut: () => Promise<{ error: ApiError | null }>;
  user: User | null;
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }: { children: ReactChild | ReactChildren }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check active session
    setUser(supabase.auth.session()?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={ {
      supabase,
      // Can't just say supabase.auth.signIn, gotta do bind()
      signIn: supabase.auth.signIn.bind(supabase.auth),
      signUp: supabase.auth.signUp.bind(supabase.auth),
      signOut: supabase.auth.signOut.bind(supabase.auth),
      user,
    } }>
      {!loading && children}
    </SupabaseContext.Provider>
  );
}

SupabaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SupabaseContext, SupabaseProvider };
