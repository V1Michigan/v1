import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSupabase from "../hooks/useSupabase";
import Head from "../components/Head";

const SendSlack: NextPage = () => {
  const { supabase, user } = useSupabase();
  const router = useRouter();

  // only track Slack analytics if user is logged in
  if (user) {
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
  }

  useEffect(() => {
    router.push(
      "https://join.slack.com/t/v1community/shared_invite/zt-1rux4efyc-STBoY07IAKYpCODM5ls5~g"
    );
  }, [router]);

  return (
    <>
      <Head title="Slack..." />
      <p>Redirecting to Slack...</p>
    </>
  );
};

export default SendSlack;
