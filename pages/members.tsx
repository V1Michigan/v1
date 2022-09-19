import { useEffect, useMemo, useState } from "react";
import { NextPage } from "next";
import { PostgrestResponse } from "@supabase/supabase-js";
import Head from "../components/Head";
import ProtectedRoute from "../components/ProtectedRoute";
import useSupabase from "../hooks/useSupabase";
import useSupabaseDownload from "../hooks/useSupabaseDownload";
import Rank from "../constants/rank";
import { RoleType, RoleColor, Interest } from "../constants/profile";
import type { Profile as _Profile } from "./profile/[username]";
import InternalLink from "../components/Link";
import ViewAvatar from "../components/profile/ViewAvatar";
import LinkedInIcon from "../public/profile/linkedin.svg";
import EmailIcon from "../public/profile/email.svg";
import WebsiteIcon from "../public/profile/website.svg";
import Fade from "../components/Fade";
import { ControlledMultiSelect } from "../components/MultiSelect";

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

const Subheader = ({
  children,
  className = "",
  ...props
}: { children: string } & React.HTMLProps<HTMLHeadingElement>) => (
  <h4
    className={`text-xs text-slate-500 font-semibold uppercase ${className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </h4>
);

const PROFILE_COLUMNS =
  "id, username, email, name, bio, linkedin, website, roles, interests";

type MemberData = Omit<
  _Profile,
  "phone" | "year" | "fields_of_study" | "partner_sharing_consent" | "resume"
> & {
  username: string;
};

const MemberBadges = ({
  roles,
  interests,
}: {
  roles: string[];
  interests: string[];
}) => {
  let badges = [
    ...roles.map((role) => ({ value: RoleType[role], color: RoleColor[role] })),
    ...interests.map((interest) => ({
      value: Interest[interest],
      color: undefined, // Use default Badge color
    })),
  ];
  let numHidden = 0;
  if (badges.length > 8) {
    numHidden = badges.length - 8;
    badges = badges.slice(0, 8);
  }
  return (
    <div className="flex gap-x-2 gap-y-1 flex-wrap items-center">
      {badges.map(({ value, color }) => (
        <Badge key={value} text={value} color={color} />
      ))}
      {numHidden > 0 && (
        <p className="inline-block text-xs text-slate-500 h-full align-middle">
          +{numHidden} more
        </p>
      )}
    </div>
  );
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
        <p className="font-semibold whitespace-nowrap my-2">{member.name}</p>
        <MemberBadges roles={member.roles} interests={member.interests} />
      </div>
      <div className="flex-1 flex flex-col gap-y-2 w-full">
        {member.bio && (
          <>
            <Subheader>About</Subheader>
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

const PAGE_SIZE = 10;

interface Option {
  label: string;
  value: string;
}

const ROLE_OPTIONS = Object.entries(RoleType).map(([key, label]) => ({
  value: key,
  label,
}));

const INTEREST_OPTIONS = Object.entries(Interest).map(([key, label]) => ({
  value: key,
  label,
}));

const Members: NextPage = () => {
  const { supabase, username } = useSupabase();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [dataFetchErrors, setDataFetchErrors] = useState<string[]>([]);

  const [page, setPage] = useState(0);

  const [query, setQuery] = useState("");
  const [filteredRoles, setFilteredRoles] = useState<Option[]>([]);
  const [filteredInterests, setFilteredInterests] = useState<Option[]>([]);

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
        .neq("fields_of_study", null) // Indirect check for if they've completed their profile
        // Arbitrary, just to have consistent order
        .order("id", { ascending: true })) as PostgrestResponse<
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

  useEffect(() => setPage(0), [query, filteredRoles, filteredInterests]);

  const filteredMembers = useMemo(() => {
    let filtered = members;
    if (query) {
      filtered = filtered.filter((member) =>
        [
          member.username,
          member.email,
          member.name,
          member.bio,
          member.website,
          ...member.roles.map((role) => RoleType[role]),
          ...member.interests.map((interest) => Interest[interest]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }
    if (filteredRoles.length) {
      filtered = filtered.filter((member) =>
        member.roles.some((role) =>
          filteredRoles.some((option) => option.value === role)
        )
      );
    }
    if (filteredInterests.length) {
      filtered = filtered.filter((member) =>
        member.interests.some((interest) =>
          filteredInterests.some((option) => option.value === interest)
        )
      );
    }
    return filtered;
  }, [members, query, filteredRoles, filteredInterests]);

  const numPages = useMemo(
    () => Math.ceil(filteredMembers.length / PAGE_SIZE),
    [filteredMembers]
  );

  if (members.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <Head title="Members" />
      {/* TODO: Nav bar */}
      <div className="flex w-full justify-center items-center">
        <InternalLink href="/dashboard" className="justify-self-start">
          <button
            className="inline-flex justify-center py-2 px-4 border border-black shadow text-sm font-medium rounded-md
              text-black hover:bg-white-700 hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white-600"
            type="button"
          >
            Back
          </button>
        </InternalLink>
        <h1 className="text-2xl mx-auto">Members</h1>
      </div>
      <div className="flex gap-x-4 my-4 w-full">
        <div>
          <Subheader className="my-2">Search</Subheader>
          <input
            className="w-full p-2 border border-gray-400 rounded placeholder-gray-400"
            type="text"
            placeholder="Type a name, role, or interest"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <Subheader className="my-2">Roles</Subheader>
          <ControlledMultiSelect
            value={filteredRoles}
            options={ROLE_OPTIONS}
            placeholder="Select roles"
            // map() is a workaround, since `value` is read-only
            onChange={(value) => setFilteredRoles(value.map((x) => x))}
          />
        </div>
        <div>
          <Subheader className="my-2">Interests</Subheader>
          <ControlledMultiSelect
            value={filteredInterests}
            options={INTEREST_OPTIONS}
            placeholder="Select interests"
            onChange={(value) => setFilteredInterests(value.map((x) => x))}
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 my-4 w-full">
        {filteredMembers
          .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) // Pagination! :D
          .map((member) => (
            <Member key={member.id} member={member} />
          ))}
        {filteredMembers.length === 0 && (
          <p className="text-center">No members found</p>
        )}
      </div>
      {members.length && (
        <>
          <p>
            Page {page + 1} of {numPages} ({filteredMembers.length} member
            {filteredMembers.length > 1 && "s"})
          </p>
          <div className="flex items-center justify-center gap-4 my-2">
            <button
              type="button"
              className="p-1 rounded-lg border border-black disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              &laquo; First
            </button>
            <button
              type="button"
              className="p-1 rounded-lg border border-black disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              &lsaquo; Previous
            </button>
            <button
              type="button"
              className="p-1 rounded-lg border border-black disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(p + 1, numPages - 1))}
              disabled={page === numPages - 1}
            >
              Next &rsaquo;
            </button>
            <button
              type="button"
              className="p-1 rounded-lg border border-black disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(numPages - 1)}
              disabled={page === numPages - 1}
            >
              Last &raquo;
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
  <ProtectedRoute minRank={Rank.ACTIVE_MEMBER}>
    <Members />
  </ProtectedRoute>
);

export default ProtectedMembers;
