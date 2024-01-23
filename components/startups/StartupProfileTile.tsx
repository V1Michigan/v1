import { StartupProfile } from "../../utils/types";

export default function StartupProfileTile({
  startupProfile,
}: {
  startupProfile: StartupProfile;
}) {
  const { headshot, name, role } = startupProfile;

  return (
    <div className="flex flex-col items-center mr-5">
      <img
        className="rounded-lg"
        height={90}
        width={90}
        src={headshot}
        alt={name}
      />
      <h1 className="mt-1">{name}</h1>
      <p className="text-gray-400 text-xs">{role}</p>
    </div>
  );
}
