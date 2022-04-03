import { useEffect, useState } from "react";
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
      <div className="flex items-center gap-x-2">
        {avatar && (
          <div className="h-12 w-12">
            <ViewAvatar avatar={avatar} />
          </div>
        )}
        {member.username}
        <span>{member.name}</span>
      </div>
    </InternalLink>
  );
};

const Members: NextPage = () => {
  const { supabase, username } = useSupabase();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      setDataFetchErrors([]);
      const {
        data,
        error: dbError,
        status,
      } = (await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .neq("username", username)) as PostgrestResponse<
        Omit<MemberData, "avatar">
      >;

      if ((dbError && status !== 406) || !data) {
        setDataFetchErrors((errors) => [
          ...errors,
          dbError?.message || "Error fetching members",
        ]);
      } else {
        setMembers(data);
        // Could we start fetching avatars here?
      }
    };
    fetchProfileData();
  }, [supabase, username]);

  if (members.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Members</h1>
      <div className="flex flex-col gap-y-2">
        {members.map((member) => (
          <Member key={member.id} member={member} />
        ))}
      </div>
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
