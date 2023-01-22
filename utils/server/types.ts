/* eslint-disable import/prefer-default-export */
import { User } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

type Route = (req: NextApiRequest, res: NextApiResponse, user: User) => void;

export type { Route };
