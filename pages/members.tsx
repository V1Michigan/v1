import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { PostgrestResponse } from "@supabase/supabase-js";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import useSupabaseDownload from "../hooks/useSupabaseDownload";
import { Rank } from "../constants/rank";
import type { Profile as _Profile } from "./profile/[username]";
import InternalLink from "../components/Link";
import ViewAvatar from "../components/profile/ViewAvatar";

const PROFILE_COLUMNS =
  "id, username, email, name, bio, year, fields_of_study, linkedin, website, roles, interests";

type MemberData = Omit<
  _Profile,
  "phone" | "partner_sharing_consent" | "resume"
> & {
  username: string;
};

const Member = ({ member }: { member: MemberData }) => {
  // TODO: Cache avatars, even when Members aren't rendered
  const { file: avatar } = useSupabaseDownload(
    "avatars",
    member.id,
    `${member.username} avatar`
  );
  return (
    <InternalLink href={`/profile/${member.username}`}>
      <div className="flex items-center gap-x-2 p-1 shadow hover:shadow-lg transition duration-500">
        {avatar && <ViewAvatar avatar={avatar} size={12} />}
        <p className="font-semibold whitespace-nowrap">{member.name}</p>
        <p className="italic text-sm">{member.bio}</p>
      </div>
    </InternalLink>
  );
};

const PAGE_SIZE = 50;

const Members: NextPage = () => {
  const { supabase, username } = useSupabase();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number | null>(null); // Total number of members available
  const numPages = useMemo(
    () => count && Math.ceil(count / PAGE_SIZE),
    [count]
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      setDataFetchErrors([]);
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      const {
        data,
        count: dbCount,
        error: dbError,
        status,
      } = (await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS, { count: "exact" })
        .gte("rank", 1) // TODO: Some people still haven't filled this out...
        .neq("username", username)
        .order("id", { ascending: true }) // Arbitrary, just to have consistent order
        .range(from, to)) as PostgrestResponse<Omit<MemberData, "avatar">>;

      if ((dbError && status !== 406) || !data) {
        setDataFetchErrors((errors) => [
          ...errors,
          dbError?.message || "Error fetching members",
        ]);
      } else {
        setMembers(data);
        setCount(dbCount);
        // Could we start fetching avatars here?
      }
    };
    fetchProfileData();
  }, [supabase, username, page]);

  if (members.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl">Members</h1>
      <div className="flex flex-col gap-y-2 p-4">
        {members.map((member) => (
          <Member key={member.id} member={member} />
        ))}
      </div>
      {count && numPages && (
        <>
          <p>
            Page {page + 1} of {numPages} ({count} members)
          </p>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lsaquo; Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, numPages - 1))}
              disabled={page === numPages - 1}
            >
              Next &rsaquo;
            </button>
          </div>
        </>
      )}
      {dataFetchErrors.map((error) => (
        <p key={error} className="text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};

const ProtectedMembers = () => (
  <ProtectedRoute minRank={Rank.RANK_3}>
    <Members />
  </ProtectedRoute>
);

export default ProtectedMembers;
