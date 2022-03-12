import Link from "next/link";
import type { Profile } from "../../pages/profile/[username]";
import {
  FieldOfStudy, Year, Interest, RoleType,
} from "../../constants/profile";

interface ViewProfileProps {
  profile: Profile
}

const ViewProfile = ({ profile }: ViewProfileProps) => (
  <div>
    <div className="flex flex-row gap-x-8 p-2">
      <Link href={ `mailto:${profile.email}` } passHref>
        <img src="/profile/email.svg" alt="Email" />
      </Link>
      <Link href={ `tel:${profile.phone}` } passHref>
        <img src="/profile/phone.svg" alt="Phone" />
      </Link>
      <Link href={ profile.linkedin } passHref>
        <img src="/profile/linkedin.svg" alt="LinkedIn" />
      </Link>
    </div>
    {/* If "additional links" is a single URL, link to that; else, just show the text */}
    {/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/.test(profile.website)
      ? <Link href={ profile.website }>{profile.website}</Link>
      : <p>{profile.website}</p>}
    <p>
      Year:
      {" "}
      {Year[profile.year]}
    </p>
    <p>
      Major
      {profile.majors.length > 1 && "s"}
      :
      {" "}
      {profile.majors.map((majorKey) => FieldOfStudy[majorKey]).join(", ")}
    </p>
    {profile.minors.length > 0 && (
      <p>
        Minor
        {profile.minors.length > 1 && "s"}
        :
        {" "}
        {profile.minors.map((minorKey) => FieldOfStudy[minorKey]).join(", ")}
      </p>
    )}
    <p>
      Roles:
      {" "}
      {profile.roles.map((roleKey) => RoleType[roleKey]).join(", ")}
    </p>
    <p>
      Interests:
      {" "}
      {profile.interests.map((interestKey) => Interest[interestKey]).join(", ")}
    </p>
  </div>
);

export default ViewProfile;
