import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import useSupabase from "../hooks/useSupabase";

// Once people are confirmed for a cohort, we probably shouldn't show this
const OnboardingCohortRegister = () => {
  const { supabase, user } = useSupabase();
  const [submitted, setSubmitted] = useState<boolean | null>(null); // null until fetched
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (user) {
        const { count, error: fetchError } = await supabase
          .from("onboarding")
          .select("status", { count: "exact", head: true })
          .eq("user_id", user.id)
          .single() as PostgrestResponse<{ count: number }>;
        if (fetchError) {
          setError(fetchError.message);
        }
        setSubmitted(Boolean(count && count > 0));
      }
    };
    fetchOnboardingStatus();
  }, [user, supabase]);
  if (!user || submitted === null) {
    return null;
  }
  const handleSubmit = async () => {
    setError(null);
    const { error: upsertError } = await supabase.from("onboarding").upsert({
      user_id: user.id,
      status: 0,
      created_at: new Date(),
    });
    if (upsertError) {
      setError(upsertError.message);
    }
    setSubmitted(true);
  };
  return (
    <div className="bg-gray-100 max-w-sm rounded-md p-4 text-center">
      <h1 className="font-bold tracking-tight text-xl text-gray-900 mb-2">
        Join a V1 Onboarding Cohort
      </h1>
      <h2 className="text-gray-800">
        {submitted ? (
          <>
            Great! ✅ We&apos;ll reach out to you via email soon.
          </>
        ) : (
          <>
            V1 provides the most driven students with an extraordinary
            network, exclusive opportunities within startups, and mentorship
            to grow and achieve great things, together. Start the process to
            become an official V1 member today.
          </>
        )}
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-500 text-gray-100 font-semibold py-3 px-4 rounded shadow mt-3 hover:opacity-75 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        disabled={ submitted }
        onClick={ handleSubmit }
      >
        I&apos;m interested &#8250;
      </button>
    </div>
  );
};

export default OnboardingCohortRegister;
