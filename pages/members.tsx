import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { PostgrestResponse } from "@supabase/supabase-js";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import useSupabaseDownload from "../hooks/useSupabaseDownload";
import { Rank } from "../constants/rank";
import { RoleType, RoleColor, Interest } from "../constants/profile";
import type { Profile as _Profile } from "./profile/[username]";
import InternalLink from "../components/Link";
import ViewAvatar from "../components/profile/ViewAvatar";
import LinkedInIcon from "../public/profile/linkedin.svg";
import EmailIcon from "../public/profile/email.svg";
import WebsiteIcon from "../public/profile/website.svg";
import Fade from "../components/Fade";

// Need these available at compile time for Tailwind
const BadgeColors: { [key: string]: string } = {
  slate: "bg-slate-100/10 border-slate-300 text-slate-500",
  red: "bg-red-100/10 border-red-300 text-red-700",
  green: "bg-green-100/10 border-green-300 text-green-700",
  blue: "bg-blue-100/10 border-blue-300 text-blue-700",
  fuchsia: "bg-fuchsia-100/10 border-fuchsia-300 text-fuchsia-700",
  purple: "bg-purple-100/10 border-purple-300 text-purple-700",
  orange: "bg-orange-100/10 border-orange-300 text-orange-700",
  pink: "bg-pink-100/10 border-pink-300 text-pink-700",
  teal: "bg-teal-100/10 border-teal-300 text-teal-700",
  indigo: "bg-indigo-100/10 border-indigo-300 text-indigo-700",
  cyan: "bg-cyan-100/10 border-cyan-300 text-cyan-700",
};

const Badge = ({ text, color = "slate" }: { text: string; color?: string }) => (
  <span
    className={`text-xs inline-block rounded-full border-2 ${BadgeColors[color]} px-2 py-1`}
  >
    {text}
  </span>
);

const PROFILE_COLUMNS =
  "id, username, email, name, bio, linkedin, website, roles, interests";

type MemberData = Omit<
  _Profile,
  "phone" | "year" | "fields_of_study" | "partner_sharing_consent" | "resume"
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
    <InternalLink
      href={`/profile/${member.username}`}
      className="flex flex-col md:flex-row justify-center items-center gap-4 p-4 shadow-lg hover:shadow-xl rounded-lg transition duration-500"
    >
      {avatar ? (
        <Fade motion={false}>
          <ViewAvatar avatar={avatar} size={20} />
        </Fade>
      ) : (
        // Same-size placeholder :D
        <div className="h-20 w-20" />
      )}
      <div className="flex-1">
        <p className="font-semibold whitespace-nowrap">{member.name}</p>
        <div className="flex gap-x-2 gap-y-1 flex-wrap">
          {/* TODO: Consider ellipsizng these if e.g. roles + interests >= 8 */}
          {member.roles.map((role) => (
            <Badge key={role} text={RoleType[role]} color={RoleColor[role]} />
          ))}
          {member.interests.map((interest) => (
            <Badge key={interest} text={Interest[interest]} />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-y-2 w-full">
        {member.bio && (
          <>
            <h4 className="text-xs text-slate-500 font-semibold">ABOUT</h4>
            <p className="italic text-sm">{member.bio}</p>
          </>
        )}
        <div className="flex gap-x-2">
          <a
            href={`mailto:${member.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-400 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-500"
          >
            <EmailIcon className="h-5 w-5 fill-gray-400" />
          </a>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-400 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-500"
            >
              <LinkedInIcon className="h-5 w-5 fill-gray-400" />
            </a>
          )}
          {/* If "additional links" is a single URL, link to that */}
          {member.website &&
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/.test(
              member.website
            ) && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-400 rounded-lg p-1 hover:bg-gray-200 transition-colors duration-500"
              >
                <WebsiteIcon className="h-5 w-5 fill-gray-400" />
              </a>
            )}
        </div>
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
      {/* TODO: Nav bar */}
      <div className="flex w-full justify-center items-center p-2">
        <InternalLink href="/dashboard" className="justify-self-start">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow text-sm font-medium rounded-md
              text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-indigo-600"
            type="button"
          >
            Back
          </button>
        </InternalLink>
        <h1 className="text-2xl mx-auto">Members</h1>
      </div>
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
