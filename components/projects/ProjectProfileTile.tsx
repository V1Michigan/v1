import { StartupProfile, StartupProfileMetadata } from "../../utils/types";
import InternalLink from "../Link";

export default function ProjectProfileTile({
  projectProfile,
  projectProfileMetadata,
}: {
  projectProfile: StartupProfile;
  projectProfileMetadata: StartupProfileMetadata;
}) {
  const { username, name } = projectProfile;
  const { role, headshot_src: headshotSrc } = projectProfileMetadata;

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  return (
    <InternalLink
      href={`/profile/${username}`}
      className="shadow-lg hover:shadow-xl rounded-lg transition duration-500"
    >
      <img
        className="border-red-400 rounded-tl-lg rounded-tr-lg border-4 w-full "
        src={anonymousPersonImage}
        height={80}
        width={80}
        alt={`${username} headshot`}
      />
      <div className="w-full p-1.5 flex flex-col items-center ">
        <h1 className="mt-1 text-sm">{name ?? username}</h1>
        <p className="text-gray-400 text-xs">{role}</p>
      </div>
    </InternalLink>
  );
}
