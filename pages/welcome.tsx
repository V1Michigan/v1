import { NextPage } from "next";
import {
  SupabaseClient,
  PostgrestSingleResponse,
  User,
} from "@supabase/supabase-js";
import useSupabase from "../hooks/useSupabase";
import ProtectedRoute from "../components/ProtectedRoute";
import Redirect from "../components/Redirect";
import Step1 from "../components/profile/onboarding/Step1";
import Step2 from "../components/profile/onboarding/Step2";
import { Rank } from "../constants/rank";

const WELCOME_EMAIL_URL =
  "https://damp-depths-59602.herokuapp.com/https://v1api-production.up.railway.app/email/welcome";
const sendWelcomeEmail = async (supabase: SupabaseClient, user: User) => {
  const session = supabase.auth.session();
  if (!session) return;
  const { access_token: accessToken } = session;
  const { email } = user;

  // Might as well keep all DB querying in the frontend for now
  const { data, error: _error } = (await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single()) as PostgrestSingleResponse<{ name: string }>;
  if (!data?.name) {
    return;
  }
  try {
    await fetch(WELCOME_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        recipient: email,
        name: data.name,
      }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const WelcomePage: NextPage = () => {
  const { supabase, user, rank, setRank } = useSupabase();

  // Type guard
  if (!user || rank === undefined) {
    return null;
  }

  if (rank === Rank.RANK_NULL) {
    return (
      <Step1
        email={user.email}
        initialName={user.user_metadata.full_name}
        initialAvatarUrl={user.user_metadata.avatar_url}
        nextStep={() => {
          setRank(Rank.RANK_0);
          sendWelcomeEmail(supabase, user);
        }}
      />
    );
  }
  if (rank === Rank.RANK_1_ONBOARDING_0 || rank === Rank.RANK_1_ONBOARDING_1) {
    // Not sure we should be using /welcome also for Step2
    return (
      <Step2
        nextStep={() =>
          // 1.0 => 1.2, 1.1 => 1.3
          setRank(
            rank === Rank.RANK_1_ONBOARDING_0
              ? Rank.RANK_1_ONBOARDING_2
              : Rank.RANK_1_ONBOARDING_3
          )
        }
      />
    );
  }
  // Else, rank === RANK_0 (not prompted to fill Step2)
  // or they've already filled it (rank >= Rank.RANK_1_ONBOARDING_2)
  return <Redirect route="/dashboard" />;
};

const ProtectedWelcome = () => (
  <ProtectedRoute>
    <WelcomePage />
  </ProtectedRoute>
);

export default ProtectedWelcome;
