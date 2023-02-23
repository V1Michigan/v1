import type { Profile } from "../../pages/profile/[username]";
import { FieldOfStudy, Year } from "../../constants/profile";
import MemberBadges from "../MemberBadges";

interface ViewProfileProps {
  profile: Profile;
}

const ViewProfile = ({ profile }: ViewProfileProps) => (
  <div>
    {profile.website && (
      <>
        {/* If "additional links" is a single URL, link to that; else, just show the text */}
        {/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/.test(
          profile.website
        ) ? (
          <a href={profile.website} target="_blank" rel="noopener noreferrer">
            {profile.website}
          </a>
        ) : (
          <p>{profile.website}</p>
        )}
      </>
    )}
    {profile.bio && <p className="my-4">{profile.bio}</p>}
    {profile.year && (
      <p>
        <strong>Year: </strong> {Year[profile.year]}
      </p>
    )}
    {profile.fields_of_study && (
      <>
        <p>
          <strong>Major: </strong>
          {profile.fields_of_study.majors.length > 1 && "s"}{" "}
          {profile.fields_of_study.majors
            .map((majorKey) => FieldOfStudy[majorKey])
            .join(", ")}
        </p>
        {profile.fields_of_study.minors?.length > 0 && (
          <p>
            <strong>Minor: </strong>
            {profile.fields_of_study.minors.length > 1 && "s"}:{" "}
            {profile.fields_of_study.minors
              .map((minorKey) => FieldOfStudy[minorKey])
              .join(", ")}
          </p>
        )}
      </>
    )}
    {profile.interests && (
      <div className="pt-2">
        <MemberBadges roles={profile.roles} interests={profile.interests} />
      </div>
    )}
  </div>
);

export default ViewProfile;
