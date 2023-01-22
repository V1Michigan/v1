import type { NextApiRequest, NextApiResponse } from "next";
import type { Route } from "./types";
import supabase from "./supabase";

const withAuth =
  (route: Route) => async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).send("Unauthorized");
      return;
    }
    const [, token] = authHeader.split("Bearer ");
    const { user, error } = await supabase.auth.api.getUser(token);
    if (!user || error) {
      // eslint-disable-next-line no-console
      console.log(user, error);
      res.status(401).send("Unauthorized");
      return;
    }
    // eslint-disable-next-line consistent-return
    return route(req, res, user);
  };

export default withAuth;
