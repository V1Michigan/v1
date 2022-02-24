import { useContext } from "react";
import { SupabaseContext } from "../contexts/SupabaseContext";

export default function useSupabase() {
  return useContext(SupabaseContext);
}
