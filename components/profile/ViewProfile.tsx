import type { Profile } from "../../pages/profile/[username]";
// import Badge from "../../pages/members";
import { FieldOfStudy, Year } from "../../constants/profile";
import MemberBadges from "../MemberBadges";

interface ViewProfileProps {
  profile: Profile;
}

// const MemberBadges = ({
//   roles,
//   interests,
// }: {
//   roles: string[];
//   interests: string[];
// }) => {
//   let badges = [
//     ...roles.map((role) => ({ value: RoleType[role], color: RoleColor[role] })),
//     ...interests.map((interest) => ({
//       value: Interest[interest],
//       color: undefined, // Use default Badge color
//     })),
//   ];
//   let numHidden = 0;
//   if (badges.length > 8) {
//     numHidden = badges.length - 8;
//     badges = badges.slice(0, 8);
//   }
//   return (
//     <div className="flex gap-x-2 gap-y-1 flex-wrap items-center">
//       {badges.map(({ value, color }) => (
//         <Badge key={value} text={value} color={color} />
//       ))}
//       {numHidden > 0 && (
//         <p className="inline-block text-xs text-slate-500 h-full align-middle">
//           +{numHidden} more
//         </p>
//       )}
//     </div>
//   );
// };

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
    {/* {profile.roles && (
      <p>
        <strong>Roles: </strong>
        {profile.roles.map((roleKey) => RoleType[roleKey]).join(", ")}
      </p>
    )} */}
    {profile.interests && (
      // <p>
      //   Interests:{" "}
      //   {profile.interests
      //     .map((interestKey) => Interest[interestKey])
      //     .join(", ")}
      // </p>
      <div className="pt-2">
        <MemberBadges roles={profile.roles} interests={profile.interests} />
      </div>
    )}
  </div>
);

export default ViewProfile;
