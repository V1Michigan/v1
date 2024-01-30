import { StartupProfile } from "../../utils/types";

export default function StartupProfileTile({
  startupProfile,
}: {
  startupProfile: StartupProfile;
}) {
  const { username, name } = startupProfile;

  return (
    <div className="flex flex-col items-center mr-5">
      <h1 className="mt-1">{name ?? username}</h1>
      {/* TODO(jonas): roles+images */}
      <p className="text-gray-400 text-xs">Software Engineer</p>
    </div>
  );
}
