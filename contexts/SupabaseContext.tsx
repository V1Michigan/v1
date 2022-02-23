import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import supabase from "../utils/supabaseClient";

interface SupabaseContextInterface {
  supabase: typeof supabase;
  signIn: (
    (credentials: { provider: string } | {email: string, password: string},
      options: { redirectTo: string })
      => {error?: string});
  signUp: (credentials: {email: string, password: string}) => {error?: string};
  signOut: () => {error?: string};
  user: {id: string, email: string};
}

const SupabaseContext = createContext<SupabaseContextInterface | null>(null);

function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);
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
