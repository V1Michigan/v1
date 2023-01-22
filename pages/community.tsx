import { NextPage } from "next";
import { useRouter } from "next/router";
import useSupabase from "../hooks/useSupabase";
import Head from "../components/Head";
import ProtectedRoute from "../components/ProtectedRoute";

const SendSlack: NextPage = () => {
  const { supabase, user } = useSupabase();
  supabase
    .from("slack")
    .insert({ user_id: user?.id })
    .then(({ error }) => {
      // following error (in the if statement) is when supabase can't add someone
      // to the table, which is okay!! This just means they've clicked on the link 
      // before. Therefore, we ignore the error.
      // eslint-disable-next-line no-console
      if (error?.code !== "23505") console.log(error);
    });
  const router = useRouter();
  router.push(
    "https://join.slack.com/t/v1community/shared_invite/zt-1namcs482-XjoRlPYk_MQX71nCGFxjWA"
  );

  return (
    <>
      <Head title="Slack..." />
      <p>Redirecting to Slack...</p>
    </>
  );
};
const ProtectedSendSlack = () => (
  <ProtectedRoute>
    <SendSlack />
  </ProtectedRoute>
);

export default ProtectedSendSlack;
