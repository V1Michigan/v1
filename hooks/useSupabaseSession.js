import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

export default function useSupabaseSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());
  }, []);
  return session;
}
