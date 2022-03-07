import Link from "next/link";
import { FaLinkedin as LinkedInIcon, FaPhone as PhoneIcon } from "react-icons/fa";
import { MdMail as EmailIcon } from "react-icons/md";
import type { Profile } from "../../pages/profile/[username]";
import {
  FieldOfStudy, Year, Interest, RoleType,
} from "../../constants/profile";

interface ViewProfileProps {
  username: string,
  profile: Profile
}

const ViewProfile = ({ username, profile }: ViewProfileProps) => (
  <div>
    <h2 className="text-2xl font-bold">{profile.name}</h2>
    <div className="flex flex-row gap-x-8 p-2">
      <Link href={ `mailto:${profile.email}` } passHref>
        <EmailIcon />
      </Link>
      <Link href={ `tel:${profile.phone}` } passHref>
        <PhoneIcon />
      </Link>
      <Link href={ profile.linkedin } passHref>
        <LinkedInIcon />
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
      {profile.fields_of_study.majors.length > 1 && "s"}
      :
      {" "}
      {profile.fields_of_study.majors.map((majorKey) => FieldOfStudy[majorKey]).join(", ")}
    </p>
    {profile.fields_of_study.minors.length > 0 && (
      <p>
        Minor
        {profile.fields_of_study.minors.length > 1 && "s"}
        :
        {" "}
        {profile.fields_of_study.minors.map((minorKey) => FieldOfStudy[minorKey]).join(", ")}
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
