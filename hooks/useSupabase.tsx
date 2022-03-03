import { useContext } from "react";
import { SupabaseContext } from "../contexts/SupabaseContext";

export default function useSupabase() {
  const supabaseContext = useContext(SupabaseContext);
  if (supabaseContext === null) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return supabaseContext;
}
