import { StartupProfile, StartupProfileMetadata } from "../../utils/types";

export default function StartupProfileTile({
  startupProfile,
  startupProfileMetadata,
}: {
  startupProfile: StartupProfile;
  startupProfileMetadata: StartupProfileMetadata;
}) {
  const { username, name } = startupProfile;
  const { role, headshot_src: headshotSrc } = startupProfileMetadata;

  const anonymousPersonImage =
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";

  return (
    <div className="flex flex-col items-center mr-5 w-36 mb-5">
      <img
        className="rounded-xl"
        src={headshotSrc ?? anonymousPersonImage}
        height={80}
        width={80}
        alt={`${username} headshot`}
      />
      <h1 className="mt-1">{name ?? username}</h1>
      <p className="text-gray-400 text-xs">{role}</p>
    </div>
  );
}
