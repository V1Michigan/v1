import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@supabase/supabase-js";
import withAuth from "../../utils/server/withAuth";
import supabase from "../../utils/server/supabase"
type RequestBody = {
  rank: number;
};
const handler = withAuth(
  async (req: NextApiRequest, res: NextApiResponse, user: User) => {
    const body = <RequestBody>req.body;
    const { rank: _rank } = body;
    if (!_rank) {
      res.status(400).send("Missing rank");
      return;
    }

    let requestedRank: number;
    try {
      requestedRank = parseInt(_rank, 10);
    } catch (e) {
      res.status(400).send("Invalid rank");
      return;
    }

    const { data, error, status } = await supabase
      .from("ranks")
      .select("rank")
      .eq("user_id", user.id)
      .single();
    if (error && status !== 406) {
      res.status(500).send(error.message);
      return;
    }

    const currentRank = data?.rank ?? null;
    if (currentRank === null) {
      res.status(500).send("Server error: no rank found for user");
      return;
    }

    if (requestedRank !== currentRank + 1) {
      res.status(400).send("Rank must be 1 higher than current rank");
      return;
    }

    if (requestedRank === 1) {
      // Check that avatar was uploaded + Step1 was completed
      const [
        { data: avatarData, error: avatarError },
        { data: step1Data, error: step1Error },
      ] = await Promise.all([
        // There is apparently no way to check that a file exists :/
        // bucket.list() has a `search` option, but it doesn't do anything!
        supabase.storage.from("avatars").createSignedUrl(user.id, 1),
        supabase
          .from("profiles")
          .select("name, username, email, phone, roles, interests")
          .eq("id", user.id)
          .single(),
      ]);

      if (!avatarData || (avatarError && status !== 406)) {
        res.status(400).send("Avatar required for rank 1");
        return;
      }

      if (step1Error && status !== 406) {
        res.status(500).send(step1Error.message);
        return;
      }
      const { name, username, email, phone, roles, interests } = step1Data;
      if (!name || !username || !phone || !roles || !interests) {
        res.status(400).send('Onboarding Step 1 not completed');
        return;
      }
      sendWelcomeEmail(email, name);
    } else {
      res
        .status(400)
        .send(
          `Self-upgrades to rank ${requestedRank} are not allowed (hi Yash 😉)`
        );
      return;
    }

    // eslint-disable-next-line no-console
    console.log(
      `Updating rank for user ${user.id}, ${currentRank} => ${requestedRank}`
    );

  // Remember that this Supabase client can override RLS...so be careful!
  const {
    error: updateError,
    status: updateStatus,
  } = await supabase
    .from('ranks')
    .update({ rank: requestedRank, updated_at: new Date() }, { returning: 'minimal' })
    .eq('user_id', user.id);
  if (updateError && updateStatus !== 406) {
    res.status(500).send(updateError.message);
    return;
  }

  res.status(204).send();
  }
);

export default handler;